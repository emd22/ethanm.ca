#include <filesystem>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

namespace fs = std::filesystem;

// Forward declarations
std::string ProcessHTML(const std::string& content, const std::vector<std::string>& args = {});
std::string LoadTemplate(const std::string& name, const std::vector<std::string>& args);
std::vector<std::string> ParseArgs(const std::string& args_str);

static std::string TrimWhitespace(const std::string& s)
{
    const auto start = s.find_first_not_of(" \t\r\n");
    if (start == std::string::npos) {
        return "";
    }
    const auto end = s.find_last_not_of(" \t\r\n");
    return s.substr(start, end - start + 1);
}

// Splits a comma-separated argument string into trimmed values.
// Commas inside nested parentheses are treated as literal text, e.g.:
//   "foo, bar(a, b), baz"  becomes  ["foo", "bar(a, b)", "baz"]
std::vector<std::string> ParseArgs(const std::string& args_str)
{
    std::vector<std::string> args;
    std::string current;
    int depth = 0;

    for (char ch : args_str) {
        if (ch == '(') {
            ++depth;
            current += ch;
        }
        else if (ch == ')') {
            --depth;
            current += ch;
        }
        else if (ch == '$' && depth == 0) {
            args.push_back(TrimWhitespace(current));
            current.clear();
        }
        else {
            current += ch;
        }
    }

    args.push_back(TrimWhitespace(current));
    return args;
}

// Loads a component file and processes it with the given arguments
std::string LoadTemplate(const std::string& name, const std::vector<std::string>& args)
{
    const std::string path = "Components/" + name + ".html";
    std::ifstream file(path);

    if (!file.is_open()) {
        return "[Error: Component '" + name + "' not found]";
    }

    std::ostringstream ss;
    ss << file.rdbuf();
    return ProcessHTML(ss.str(), args);
}

// Substitutes {{N}} placeholders and expands %%component(args)%% macros
std::string ProcessHTML(const std::string& content, const std::vector<std::string>& args)
{
    std::string result = content;

    // Substitute positional placeholders: {{0}}, {{1}}, ...
    for (size_t i = 0; i < args.size(); ++i) {
        const std::string placeholder = "{{" + std::to_string(i) + "}}";
        size_t pos = 0;
        while ((pos = result.find(placeholder, pos)) != std::string::npos) {
            result.replace(pos, placeholder.size(), args[i]);
            pos += args[i].size();
        }
    }

    // Expand component macros: %%ComponentName%% or %%ComponentName(arg0, arg1, ...)%%
    size_t pos = 0;
    while ((pos = result.find("%%", pos)) != std::string::npos) {
        const size_t end = result.find("%%", pos + 2);

        if (end == std::string::npos) {
            break;
        }

        const std::string macro = result.substr(pos + 2, end - pos - 2);

        std::string name;
        std::vector<std::string> next_args;

        const size_t open = macro.find('(');
        const size_t close = macro.rfind(')');

        if (open != std::string::npos && close != std::string::npos && close > open) {
            name = TrimWhitespace(macro.substr(0, open));
            next_args = ParseArgs(macro.substr(open + 1, close - open - 1));
        }
        else {
            name = TrimWhitespace(macro);
        }

        const std::string replacement = LoadTemplate(name, next_args);
        result.replace(pos, end - pos + 2, replacement);
        pos += replacement.size();
    }

    return result;
}

int main(int argc, char* argv[])
{
    if (argc < 3) {
        std::cout << "Usage: " << argv[0] << " [input file] [output file]\n";
        return 1;
    }

    if (!fs::exists("Components")) {
        fs::create_directory("Components");
    }

    std::ifstream input_file(argv[1]);
    if (!input_file.is_open()) {
        std::cerr << "Error: could not open input file '" << argv[1] << "'\n";
        return 1;
    }

    std::ostringstream ss;
    ss << input_file.rdbuf();

    const std::string output = ProcessHTML(ss.str());

    std::ofstream output_file(argv[2]);
    if (!output_file.is_open()) {
        std::cerr << "Error: could not open output file '" << argv[2] << "'\n";
        return 1;
    }

    output_file << output;
    return 0;
}
