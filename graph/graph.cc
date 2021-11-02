#include "graph.hh"

#include <algorithm>
#include <cassert>
#include <iostream>

// Get the number of nodes as max { v | \exists u : ((u, v) \in E || (v, u) \in E) }
std::size_t _compute_num_nodes(const std::vector<Edge>& edges) {

  int max = 0;

  for (const auto& e : edges) {
    max = std::max(max,
                   std::max(std::get<0>(e), std::get<1>(e)));
  }

  return max + 1;
}

// Crate an adj list from a sequence of edges in O(n)
// n: # edges
AdjList _make_adj_list(const std::vector<Edge>& edges,
                         std::size_t num_nodes) {

  AdjList adj(num_nodes);

  for (const auto& e : edges) {
    Node u = e.first;
    Node v = e.second;

    adj[u].push_back(v);
  }

  return adj;
}

Graph::Graph(std::initializer_list<Edge> edges)
  :  _num_nodes(_compute_num_nodes(edges)), _adj(_make_adj_list(edges, _num_nodes)) { }

Graph::Graph(std::initializer_list<Edge> edges, std::initializer_list<Weight> weights)
  : _num_nodes(_compute_num_nodes(edges)), _adj(_make_adj_list(edges, _num_nodes)), _weights(weights) {

  assert(edges.size() == weights.size());

}

unsigned Graph::num_nodes() {
  return _num_nodes;
}

const std::vector<Weight>& Graph::weights() {
  return _weights;
}

const std::vector<Node>& Graph::adjacent_to(Node v) {
  return this->_adj[v];
}

bool Graph::is_connected() {
  return std::all_of(this->_adj.cbegin(), this->_adj.cend(),
                     [](std::vector<Node> list) { return !list.empty();  });
}
