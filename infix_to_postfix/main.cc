// Compile with: g++ -Wextra -Wall main.cc convert.cc -o main -std=c++11

#include <iostream>
#include <string>
#include <stack>
#include "convert.hh"

int main() {
  std::string infix_expression, postfix_expression;
  std::stack<char> stack;
  char a;

  std::cout << "Insert an expression (infix notation): ";
  std::cin >> infix_expression;

  for (auto c: infix_expression) {
    postfix_expression.append(Convert::convert(stack, c));
  }

  while (!stack.empty()) {
    postfix_expression.push_back(stack.top());
    stack.pop();
  }

  std::cout << "Postfix notation: " << postfix_expression << std::endl;
}
