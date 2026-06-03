#include <chrono>
#include <filesystem>
#include <format>
#include <fstream>
#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <vector>

namespace fs = std::filesystem;

static const char* spCurrentPath = nullptr;

enum class eListType
{
    None,
    Unordered,
    Ordered,
};

std::string get_day_suffix(int day)
{
    if (day >= 11 && day <= 13)
        return "th";
    switch (day % 10) {
    case 1:
        return "st";
    case 2:
        return "nd";
    case 3:
        return "rd";
    default:
        return "th";
    }
}

std::string TimeStringFromPostPath(const std::string& path)
{
    using namespace std::chrono;
    std::string date_str = path.substr(0, path.find_first_of('_'));

    // Convert 260702 to 26, 07, 02
    int yy = std::stoi(date_str.substr(0, 2));
    int mm = std::stoi(date_str.substr(2, 2));
    int dd = std::stoi(date_str.substr(4, 2));

    auto parsed_date = year(2000 + yy) / month(mm) / day(dd);
    unsigned int day = static_cast<unsigned int>(parsed_date.day());

    // Output in the format of June 2nd, 2026
    return std::format("{:L%B} {}{}, {:%Y}", parsed_date.month(), day, get_day_suffix(day), parsed_date.year());
}


class Md2Html
{
private:
    // Trim whitespace from the right side of the string
    std::string Trim(std::string s)
    {
        s.erase(s.find_last_not_of(" \t\n\r\f\v") + 1);
        return s;
    }

    std::string ParseInline(const std::string& line)
    {
        std::string output = line;

        // Match [text](link)
        std::regex link_re(R"(\[(\s*[^\]]+)\]\((.+)\))");
        if (std::regex_search(line, link_re)) {
            output = std::regex_replace(output, link_re, "<a href=\"$2\">$1</a>");
        }

        // Match `inline code`
        std::regex inline_code_re(R"(\`(\s*[^\`]+)\`)");
        if (std::regex_search(line, inline_code_re)) {
            output = std::regex_replace(output, inline_code_re, "<span class=\"hp-inl-code\">$1</span>");
            return output;
        }

        std::regex bold_re(R"(\*\*([^\*]+)\*\*)");
        if (std::regex_search(line, bold_re)) {
            output = std::regex_replace(output, bold_re, "<b>$1</b>");
        }


        std::regex italic_re(R"(\_([^\_]+)\_)");
        if (std::regex_search(line, italic_re)) {
            output = std::regex_replace(output, italic_re, "<i>$1</i>");
        }


        return output;
    }


    // Process a single line of Markdown
    std::string ProcessLine(const std::string& raw_line, const std::string& next_line)
    {
        std::string line = Trim(raw_line);

        // Code blocks
        if (line.rfind("```", 0) == 0) {
            std::string language_spec = "";

            if (line.ends_with("cpp")) {
                language_spec = "language-cpp";
            }
            else if (line.ends_with("armasm")) {
                language_spec = "language-armasm";
            }
            else if (line.ends_with("x86asm")) {
                language_spec = "language-x86asm";
            }


            std::string prefix = "";
            // If a paragraph was active, we must close it before starting a code block
            if (mbEmittingParagraph) {
                mbEmittingParagraph = false;
                prefix = "</p>\n";
            }

            if (!mbInCodeBlock) {
                mbInCodeBlock = true;
                return std::format("{}<pre><code class=\"{}\">", prefix, language_spec);
            }
            else {
                mbInCodeBlock = false;
                return prefix + "</code></pre>\n";
            }
        }

        // Code blocks treat lines literally
        if (mbInCodeBlock) {
            return raw_line + "\n";
        }

        // Close the paragraph if we have an empty line
        if (line.empty()) {
            if (mbEmittingParagraph) {
                mbEmittingParagraph = false;
                return "</p>\n";
            }
            return "";
        }

        // Headings
        if (line[0] == '#') {
            size_t hash_count = 0;
            while (hash_count < line.length() && line[hash_count] == '#') {
                hash_count++;
            }

            if (hash_count <= 6 && hash_count < line.length() && line[hash_count] == ' ') {
                std::string prefix = "";
                // If a paragraph was active, close it before emitting the heading
                if (mbEmittingParagraph) {
                    mbEmittingParagraph = false;
                    prefix = "</p>\n";
                }

                std::string content = line.substr(hash_count + 1);
                std::string tag = "h" + std::to_string(hash_count);
                return prefix + "<" + tag + ">" + content + "</" + tag + ">\n";
            }
        }


        // Paragraph blocks
        std::string prefix = "";
        std::string suffix = "";


        // Ordered list
        if (line.length() > 3 && (line[1] == '.' || line[2] == '.')) {
            if (mListType != eListType::Ordered) {
                prefix = "<ol>";
            }
            auto list_content = line.find_first_not_of(" \t", 2);
            mListType = eListType::Ordered;
            return prefix + std::format("<li>{}</li>", line.substr(list_content));
        }
        else if (line.length() > 3 && (line[0] == '-' && line[1] == ' ')) {
            if (mListType != eListType::Unordered) {
                prefix = "<ul>";
            }
            auto list_content = line.find_first_not_of(" \t", 2);
            mListType = eListType::Unordered;
            prefix += "<li>";
            suffix += "</li>";
            line = line.substr(list_content);
        }
        else {
            if (mListType == eListType::Unordered) {
                prefix = "</ul>";
            }
            else if (mListType == eListType::Ordered) {
                prefix = "</ol>";
            }
            mListType = eListType::None;
        }


        // This is the start of a new paragraph block
        if (!mbEmittingParagraph && mListType == eListType::None) {
            mbEmittingParagraph = true;
            prefix += "<p>\n";
        }
        else {
            // If we are continuing an ongoing paragraph block,
            // prepend a space to cleanly join it with the previous line
            prefix += "\n";
        }

        // Look ahead, if the next line is empty, a heading or a code block,
        // this current line is the end of the paragraph.
        std::string trimmed_next = Trim(next_line);
        if (trimmed_next.empty() || trimmed_next[0] == '#' || trimmed_next.rfind("```", 0) == 0) {
            mbEmittingParagraph = false;
            suffix += "\n</p>\n";
        }

        line = ParseInline(line);

        return prefix + line + suffix;
    }

public:
    std::string Convert(const std::string& path)
    {
        std::ifstream input_file("pages/posts/markdown/" + path);
        if (!input_file.is_open()) {
            std::cerr << "Cannot find md file at pages/posts/" << path << '\n';
            return "";
        }

        std::string line;
        std::vector<std::string> lines;

        while (std::getline(input_file, line)) {
            lines.push_back(line);
        }

        std::string html = "";

        for (size_t i = 0; i < lines.size(); i++) {
            std::string next_line = (i + 1 < lines.size()) ? lines[i + 1] : "";
            html += ProcessLine(lines[i], next_line);
        }

        // Cleanup any stragglers
        if (mbEmittingParagraph) {
            html += "</p>\n";
            mbEmittingParagraph = false;
        }
        if (mbInCodeBlock) {
            html += "</code></pre>\n";
            mbInCodeBlock = false;
        }

        return html;
    }

private:
    bool mbInCodeBlock = false;
    bool mbEmittingParagraph = false;

    eListType mListType = eListType::None;
};

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
    for (size_t i = 0; i < args.size(); i++) {
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

        if (name == "loadmd") {
            if (next_args.size() < 1) {
                std::cerr << "loadmd requires path\n";
            }
            else {
                Md2Html md2html;
                std::string html_repr = md2html.Convert(next_args[0]);
                result.replace(pos, end - pos + 2, html_repr);
                pos += html_repr.size();

                continue;
            }
        }

        else if (name == "getpathdate") {
            if (next_args.size() < 1) {
                std::cerr << "getpathdate requires path\n";
            }
            else {
                std::string date_result = TimeStringFromPostPath(next_args[0]);
                result.replace(pos, end - pos + 2, date_result);
                pos += date_result.size();

                continue;
            }
        }

        else if (name == "getcurpathdate") {
            std::string current_path = std::string(spCurrentPath);
            std::string trimmed_date_path = current_path.substr(current_path.find_last_of('/') + 1);

            std::string date_result = TimeStringFromPostPath(trimmed_date_path);
            result.replace(pos, end - pos + 2, date_result);
            pos += date_result.size();

            continue;
        }

        else if (name == "loadlinkedmd") {
            std::string current_path = std::string(spCurrentPath);
            std::string trimmed_path = current_path.substr(current_path.find_last_of('/') + 1);
            trimmed_path = trimmed_path.substr(0, trimmed_path.find_last_of('.')) + ".md";

            Md2Html md2html;
            std::string html_repr = md2html.Convert(trimmed_path);
            result.replace(pos, end - pos + 2, html_repr);
            pos += html_repr.size();

            std::cout << "Loading MD " << trimmed_path << '\n';

            continue;
        }

        const std::string replacement = LoadTemplate(name, next_args);
        result.replace(pos, end - pos + 2, replacement);
        pos += replacement.size();
    }

    return result;
}


enum class eHeadingLevel
{
    Normal,
    H1,
    H2,
    H3,
    H4,
};


std::string AsHtml(eHeadingLevel level, bool emit_p, const std::string& text)
{
    if (level == eHeadingLevel::Normal) {
        if (emit_p) {
            return std::format("<p>{}</p>", text);
        }

        return text;
    }

    int level_num = static_cast<int>(level);

    return std::format("<h{}>{}</h{}>", level_num, text, level_num);
}


void BuildFile(const char* path, const std::string& output_path)
{
    spCurrentPath = path;

    std::cout << "Building " << path << " to " << output_path << '\n';

    std::ifstream input_file(path);
    if (!input_file.is_open()) {
        std::cerr << "Error: could not open input file '" << path << "'\n";
        return;
    }

    std::ostringstream ss;
    ss << input_file.rdbuf();

    const std::string output = ProcessHTML(ss.str());

    std::ofstream output_file(output_path);
    if (!output_file.is_open()) {
        std::cerr << "Error: could not open output file '" << output_path << "'\n";
        return;
    }

    output_file << "<!-- Generated by Ethan's C++ HTML Preprocessor :) -->";

    output_file << output;
}

void CompileAllInFolder(const char* folder_path)
{
    auto it = std::filesystem::recursive_directory_iterator(folder_path);

    for (const fs::directory_entry& entry : it) {
        if (entry.is_directory()) {
            continue;
        }

        if (entry.path().extension() != ".html") {
            continue;
        }

        // Remove the root dir from the path:
        // root/posts/something.html -> posts/something.html
        fs::path local_path = "public" / entry.path().lexically_relative(*entry.path().begin());

        BuildFile(entry.path().c_str(), local_path.c_str());
    }
}

int main(int argc, char* argv[])
{
    if (!fs::exists("Components")) {
        fs::create_directory("Components");
    }

    CompileAllInFolder("pages");

    return 0;
}
