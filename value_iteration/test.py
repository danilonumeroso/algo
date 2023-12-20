import numpy as np
from value_iteration import value_iteration, apply_action, extract_policy
from logic import get_actions, is_winner, is_draw, is_x_turn

def random_player(s):
    return np.random.choice(get_actions(s))

def human_player(s):
    human_readable_state = np.copy(s).astype(str)
    human_readable_state[s == 1] = 'X'
    human_readable_state[s == 0] = ' '
    human_readable_state[s == -1] = 'O'

    print(human_readable_state.reshape((3,3)))
    action = int(input(f"Input your move ({get_actions(s)}): "))
    return action

def test_against(other_fn, num_samples=1):
    W, D, L = 0, 0, 0

    for _ in range(num_samples):
        s = np.zeros(9)
        while True:
            action = policy[tuple(s)] if is_x_turn(s) else other_fn(s)
            s = apply_action(action, s)

            if is_winner(s, 1):
                W += 1
                break

            if is_winner(s, -1):
                L += 1
                break

            if is_draw(s):
                D += 1
                break


    print(f"W/D/L = {W}/{D}/{L}")


if __name__ == "__main__":
    print("Performing Value Iteration...")
    v_fn = value_iteration(verbose=False)
    policy = extract_policy(v_fn)

    num_samples = 100
    print("Testing agent...")
    test_against(random_player, num_samples)

    print("Play against the agent (Agent is X)!")
    test_against(human_player, num_samples=5)
