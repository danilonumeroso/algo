#ifndef GRAPH_HH
#define GRAPH_HH

#include <vector>

typedef int Node;
typedef float Weight;
typedef std::pair<Node, Node> Edge;
typedef std::vector<std::vector<Node>> AdjList;

/*
  Class "Graph" for experimenting with std::initializer_list<T>.
*/
struct Graph {
public:
  Graph(std::initializer_list<Edge>);
  Graph(std::initializer_list<Edge>, std::initializer_list<Weight>);

  unsigned num_nodes();
  const std::vector<Weight>& weights();
  const std::vector<Node>& adjacent_to(Node);
  bool is_connected();
private:
  std::size_t _num_nodes;
  AdjList _adj;
  std::vector<Weight> _weights;
};

#endif
