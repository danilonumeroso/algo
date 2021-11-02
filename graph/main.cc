// Compile with: g++ -Wextra -Wall main.cc graph.cc -o main -std=c++11

#include <iostream>
#include "graph.hh"

int main() {

  Graph g = {{ {0, 1}, {1, 0}, {1, 2}, {2, 0} }, {1.5, 2.0, 3.14, 4.0}};

  std::cout << "Is the graph connected? " << (g.is_connected() ? "Yes" : "No") << std::endl;
  std::cout << "Node 1 neighbours: ";

  for (auto u : g.adjacent_to(1)) {
    std::cout << u << " ";
  }

  std::cout << std::endl;
  std::cout << "Weights: ";

  for (auto w: g.weights()) {
    std::cout << w << " ";
  }

  std::cout << std::endl;
  return 0;
}
