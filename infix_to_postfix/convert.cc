#include "convert.hh"
#include <string>
#include <stack>
#include <algorithm>
#include <iostream>

namespace Convert {

  typedef int Priority;

  Priority op_precedence(char op) {
    switch(op) {
    case '+':
    case '-':
      return 0;
    case '*':
    case '/':
      return 1;

    case '(':
    case ')':
      return 1;

    default:
      return 1;
    }
  }

  bool is_arithmetic_symbol(char c) {
    return c == '*' || c == '+' || c == '/' || c == '-';
  }

  std::string convert(std::stack<char>& s, char c) {

    std::string res = "";

    if (c == '(') {
      s.push(c);
      return res;
    }

    if (c == ')') {
      // non-closed brackets is undefined behaviour
      while (s.top() != '(') {
        res.push_back(s.top());
        s.pop();
      }
      s.pop(); // remove '('
      return res;
    }

    if (is_arithmetic_symbol(c)) {
      while (!s.empty() && s.top() != '(') {
        if (op_precedence(c) > op_precedence(s.top())) {
          break;
        }


        res.push_back(s.top());
        s.pop();

      }

      s.push(c);

      return res;
    }

    // just accumulate
    res.push_back(c);
    return res;
  }

}
