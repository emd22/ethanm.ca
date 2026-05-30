#include <filesystem>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

namespace fs = std::filesystem;

// Forward declarations
std::string ProcessHTML(std::stringstream& ss, const std::vector<std::string>& args = {});
std::string LoadTemplate(const std::string& template_name, const std::vector<std::string>& args);
std::vector<std::string> ParseArgs(const std::string& args_str);

// Parses a comma-separated string into a vector of trimmed arguments
std::vector<std::string> ParseArgs(const std::string& args_str)
{
    std::vector<std::string> args;
    std::string item;

    bool escape_kw = false;

    // Use a basic while loop to iterate through every character
    size_t i = 0;
    while (i < args_str.length()) {
        char ch = args_str[i];
        if (ch == '\n' || ch == '\r') {
            ++i;
            continue;
        }

        if (ch == '(') {
            escape_kw = true;
        }
        else if (ch == ')') {
            escape_kw = false;
        }

        if (ch == '$') {
            if (escape_kw) {
                item += '$';
            }
            else {
                size_t start = item.find_first_not_of(" \t");
                if (start == std::string::npos) {
                    args.push_back("");
                }
                else {
                    size_t end = item.find_last_not_of(" \t");
                    args.push_back(item.substr(start, end - start + 1));
                }
                item.clear(); // Reset for the next argument
            }
        }
        else {
            item += ch;
        }


        ++i;
    }

    // Process and push the final remaining item after the loop ends
    size_t start = item.find_first_not_of(" \t");
    if (start == std::string::npos) {
        args.push_back("");
    }
    else {
        size_t end = item.find_last_not_of(" \t");
        args.push_back(item.substr(start, end - start + 1));
    }

    return args;
}

// Loads the template and passes its specific arguments down for processing
std::string LoadTemplate(const std::string& template_name, const std::vector<std::string>& args)
{
    std::string file_path = "Components/" + template_name + ".html";
    std::ifstream template_file(file_path);

    if (!template_file.is_open()) {
        return "[Error: Template " + template_name + " not found]";
    }

    std::stringstream ss;
    ss << template_file.rdbuf();

    // Process the loaded file with its dedicated arguments
    return ProcessHTML(ss, args);
}


std::string ProcessHTML(std::stringstream& ss, const std::vector<std::string>& args)
{
    std::string content = "";
    char ch;

    // Read the entire stream character-by-character into a single buffer
    while (ss.get(ch)) {
        content += ch;
    }

    // Replace placeholders like {{0}}, {{1}} globally across the entire content
    for (size_t i = 0; i < args.size(); ++i) {
        std::string placeholder = "{{" + std::to_string(i) + "}}";
        size_t p_pos = 0;
        while ((p_pos = content.find(placeholder, p_pos)) != std::string::npos) {
            content.replace(p_pos, placeholder.length(), args[i]);
            p_pos += args[i].length();
        }
    }

    // Process macro calls globally (now safely matching across multiple lines)
    size_t start_pos = 0;
    size_t current_pos;

    while ((current_pos = content.find("%%", start_pos)) != std::string::npos) {
        size_t end_pos = content.find("%%", current_pos + 2);

        if (end_pos != std::string::npos) {
            std::string macro_content = content.substr(current_pos + 2, end_pos - (current_pos + 2));

            std::string template_key = macro_content;
            std::vector<std::string> next_args;

            // Check if this macro contains parameters, e.g., Hello(1,
            //                                              2, 3)
            size_t open_paren = macro_content.find('(');
            size_t close_paren = macro_content.find_last_of(')');

            if (open_paren != std::string::npos && close_paren != std::string::npos && close_paren > open_paren) {
                template_key = macro_content.substr(0, open_paren);
                int front_offset = 1;
                int back_offset = 1;
                char tkch;
                while (isspace(tkch = macro_content[open_paren + front_offset])) {
                    ++front_offset;
                }

                while (isspace(tkch = macro_content[close_paren - open_paren - back_offset])) {
                    ++back_offset;
                }
                std::string args_str = macro_content.substr(open_paren + front_offset,
                                                            close_paren - open_paren - back_offset);

                // ParseArgs will receive the raw arguments block including its newlines
                next_args = ParseArgs(args_str);
            }

            // Trim potential whitespace/newlines out of the template key name itself
            size_t key_start = template_key.find_first_not_of(" \t\r\n");
            if (key_start != std::string::npos) {
                size_t key_end = template_key.find_last_not_of(" \t\r\n");
                template_key = template_key.substr(key_start, key_end - key_start + 1);
            }

            // Load the child template with its clean arguments
            std::string replacement_content = LoadTemplate(template_key, next_args);

            // Replace the macro block with the generated template content
            content.replace(current_pos, end_pos - current_pos + 2, replacement_content);

            // Update start position to the end of the injected text to avoid infinite loops
            start_pos = current_pos + replacement_content.length();
        }
        else {
            break; // No matching closing %% found
        }
    }

    return content;
}

// // Processes the HTML stream, resolving both macros and localized template arguments
// std::string ProcessHTML(std::stringstream& ss, const std::vector<std::string>& args)
// {
//     std::string output = "";
//     std::string line;

//     while (std::getline(ss, line)) {
//         // Replace any placeholders like {{0}}, {{1}} passed into THIS file context
//         for (size_t i = 0; i < args.size(); ++i) {
//             std::string placeholder = "{{" + std::to_string(i) + "}}";
//             size_t p_pos = 0;
//             while ((p_pos = line.find(placeholder, p_pos)) != std::string::npos) {
//                 line.replace(p_pos, placeholder.length(), args[i]);
//                 p_pos += args[i].length();
//             }
//         }

//         // Process any inner macro calls: %%TemplateName(arg1, arg2)%%
//         size_t start_pos = 0;
//         size_t current_pos;

//         while ((current_pos = line.find("%%", start_pos)) != std::string::npos) {
//             size_t end_pos = line.find("%%", current_pos + 2);

//             if (end_pos != std::string::npos) {
//                 std::string macro_content = line.substr(current_pos + 2, end_pos - (current_pos + 2));

//                 std::string template_key = macro_content;
//                 std::vector<std::string> next_args;

//                 // Check if this macro contains parameters, e.g., Hello(1, 2, 3)
//                 size_t open_paren = macro_content.find('(');
//                 size_t close_paren = macro_content.find_last_of(')');

//                 if (open_paren != std::string::npos && close_paren != std::string::npos && close_paren > open_paren)
//                 {
//                     template_key = macro_content.substr(0, open_paren);
//                     std::string args_str = macro_content.substr(open_paren + 1, close_paren - open_paren - 1);
//                     next_args = ParseArgs(args_str);
//                 }

//                 // Load the child template with its clean arguments
//                 std::string replacement_content = LoadTemplate(template_key, next_args);

//                 // Replace the macro with the generated template content
//                 line.replace(current_pos, end_pos - current_pos + 2, replacement_content);

//                 // Update start position to avoid infinite loops
//                 start_pos = current_pos + replacement_content.length();
//             }
//             else {
//                 break; // No matching closing %% found
//             }
//         }
//         output += (line + '\n');
//     }

//     return output;
// }

int main(int argc, char* argv[])
{
    if (argc < 3) {
        std::cout << argv[0] << " [input file] [output file]\n";
        return 0;
    }

    if (!fs::exists("Components")) {
        fs::create_directory("Components");
    }

    std::ifstream input_file(argv[1]);
    if (!input_file.is_open()) {
        std::cerr << "Could not open input file" << std::endl;
        return 0;
    }

    std::stringstream ss;
    ss << input_file.rdbuf();

    // The root/input file starts with zero arguments
    std::string output = ProcessHTML(ss, {});
    std::ofstream output_file(argv[2]);

    output_file << output;

    return 0;
}
