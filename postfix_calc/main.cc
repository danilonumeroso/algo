// Compile with: g++ -Wextra -Wall main.cc -o main -std=c++11

#include <iostream>
#include <string>
#include <stack>

bool is_arithmetic_symbol(char c) {
  return c == '*' || c == '+' || c == '/' || c == '-';
}

int main() {
  std::string postfix_expression;
  std::stack<float> stack;

  std::cout << "Insert an expression (postfix notation): ";
  std::cin >> postfix_expression;

  for (auto c: postfix_expression) {

    if (!is_arithmetic_symbol(c)) {
      stack.push(c - '0'); //convert char to float, e.g. '9' -> 9.0;
      continue;
    }

    float op2, op1;
    op2 = stack.top();
    stack.pop();

    op1 = stack.top();
    stack.pop();

    switch (c) {
    case '+':
      stack.push(op1 + op2);
      break;
    case '-':
      stack.push(op1 - op2);
      break;
    case '*':
      stack.push(op1 * op2);
      break;
    case '/':
      stack.push(op1 / op2);
      break;
    }

  }

  std::cout << "Result: " << stack.top() << std::endl;
}
