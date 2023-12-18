import numpy as np

def is_winner(board, player):
    winning_combinations = np.array([[0, 1, 2], [3, 4, 5], [6, 7, 8],
                                     [0, 3, 6], [1, 4, 7], [2, 5, 8],
                                     [0, 4, 8], [2, 4, 6]])

    for combination in winning_combinations:
        if (board[combination] == player).all():
            return True

    return False


def is_draw(board):
    return 0 not in board


def is_terminal(state):
    return is_winner(state, 1) or is_winner(state, -1) or is_draw(state)


def is_not_terminal(state):
    return not is_terminal(state)


def get_actions(state):
    return (state == 0).nonzero()[0]


def is_x_turn(state):
    return (state == 1).sum() == (state == -1).sum()

