import numpy as np
from collections import defaultdict
from copy import deepcopy
from statistics import mean
from logic import is_winner, is_draw, is_terminal, is_not_terminal, is_x_turn, get_actions

def all_possible_states():
    from itertools import product
    possible_values = [0, 1, -1]
    all_states = map(np.array, product(possible_values, repeat=9))

    # 1- No legal Tic Tac Toe states have number_of_o > number_of_x or number_of_x - number_of_o > 1
    all_states = filter(lambda s: (s==1).sum() - (s==-1).sum() in [0, 1], all_states)

    # 2- Filter out all states where both X and O won
    all_states = filter(lambda s: not (is_winner(s, 1) and is_winner(s, -1)), all_states)

    return list(all_states)


def apply_action(action, state):
    next_state = np.copy(state)
    next_state[action] = -1 if (state == 1).sum() > (state == -1).sum() else 1
    return next_state


def reward_fn(state):
    if is_winner(state, 1):
        return 0

    if is_winner(state, -1):
        return 1

    return 0.1


def reset_value_fn(states):
    v_fn = defaultdict(float)
    for s in states:
        v_fn[tuple(s)] = reward_fn(s)
    return v_fn


def value_iteration(discount=1.0, epsilon=1e-5, verbose=False):

    def one_step_value_iteration():
        delta = 0
        i=0
        for s in filter(is_not_terminal, states):
            old_v = v_fn[tuple(s)]
            values = []

            for action in get_actions(s):
                next_s = apply_action(action, s) if is_x_turn(s) else np.copy(s)

                if is_terminal(next_s):
                    action_value = reward_fn(next_s)
                else:
                    action_value = mean([discount*v_fn[tuple(apply_action(next_a, next_s))] for next_a in get_actions(next_s)])

                values.append(action_value)

            v_fn[tuple(s)] = min(values)
            delta = max(delta, abs(v_fn[tuple(s)] - old_v))
        return delta

    delta = float('inf')
    states = all_possible_states()
    v_fn = reset_value_fn(states)

    while delta > epsilon:
        delta = one_step_value_iteration()
        if verbose:
            print(f"CONVERGENCE_TEST::delta = {delta}")

    return v_fn


def extract_policy(v_fn):
    def choose_action(s):
        values = []
        actions = get_actions(s)
        for action in actions:
            next_s = apply_action(action, s)

            if is_terminal(next_s):
                action_value = reward_fn(next_s)
            else:
                action_value = mean([v_fn[tuple(apply_action(next_a, next_s))] for next_a in get_actions(next_s)])

            values.append(action_value)

        return actions[np.argmin(values)]

    policy = defaultdict(int)
    for s in v_fn:
        s_vec = np.array(s)
        if is_terminal(s_vec):
            continue

        policy[s] = choose_action(s_vec)

    return policy


