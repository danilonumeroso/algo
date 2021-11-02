#ifndef CONVERT_HH
#define CONVERT_HH

#include <string>
#include <stack>

namespace Convert {

  typedef int Priority;

  Priority op_precedence(char op);
  bool is_arithmetic_symbol(char c);
  std::string convert(std::stack<char>&, char c);

}

#endif
