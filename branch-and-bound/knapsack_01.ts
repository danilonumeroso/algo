import { BBNode, branch_and_bound, BB_Param } from "./branch_and_bound"

type Weight = number
type Value = number
type KS_Item = [Weight, Value]

/*
  Utility function for defining branch and bound operations specifically for the Knapsack 0-1 problem.
*/
function knapsack_01_config(items: KS_Item[],
                            max_capacity: number,
                            n_vars: number): Pick<BB_Param, "branch" | "branch_args" | "bound" | "bound_args"> {
    return {

        /*
          *Branch*
          Split the search space by considering two constrasting scenarios:
          - i-th item is included in the solution (v1);
          - i-th item is not (v2).
        */

        branch_args: [items],
        branch: (u: BBNode, ...args: any[]) => {
            const items: KS_Item[] = args[0];

            let v1: BBNode = new BBNode({
                weight: items[u.level() + 1][0],
                cost: items[u.level() + 1][1],
                include: true,
                label: `x_${u.level() + 2}`
            });

            let v2: BBNode = new BBNode({
                ...v1,
                include: false,
            });

            return [v1, v2];
        },

        /*
         *Bound*
         Compute a bound for a given branch by selecting greedily successive elements according to
         their values, i.e. items is assumed to be sorted according to item.value.
        */
        bound_args: [items, max_capacity, n_vars],
        bound: (u: BBNode, ...args: any[]) => {

            const [items, max_capacity, n_vars] = args as [KS_Item[], number, number];

            if (!u.is_feasible())
                return -Infinity;

            let cost_bound = u.tot_cost();
            let tot_weight = u.tot_weight();

            for (let i = u.level() + 1; i < n_vars; ++i) {
                if (tot_weight + items[i][0] > max_capacity) {
                    /*
                      In case the i-th element exceeds the knapsack capacity, include a fractionality
                      of the element in order to computer a proper upper cost bound.
                    */
                    cost_bound += (max_capacity - tot_weight) * items[i][1] / items[i][0];
                    break;
                }

                tot_weight += items[i][0];
                cost_bound += items[i][1];

            }

            return cost_bound;
        }
    }
}

function main(): void {
    let max_capacity: number = 10;

    // items = { x | x \in Weights \times Value }
    let items: KS_Item[] = [[2, 40], [3.14, 50], [1.98, 100], [5, 95], [3, 30]];

    console.log("========")
    console.log("Input")
    console.log(items.map((x, i) => `x_${i} = [${x[0]}, ${x[1]}]`).join('\n'));
    console.log("========\n")
    const [root, value, solution] = branch_and_bound({
        dummy_root: new BBNode({
            cost: 0,
            weight: 0,
            include: false,
            // Introduce problem constraints in the (dummy) root node. Constraints will be passed down to
            // children nodes.
            constraints: x => x.tot_weight() <= max_capacity,
            label: 'dummy'
        }),
        n_vars: items.length,
        ...knapsack_01_config(items, max_capacity, items.length)
    });

    console.log(`Best solution: ${solution.map(x => x.label).join(",")}`);
    console.log(`Value: ${solution.map(x => x.cost).join(",")}`);
    console.log(`Total value: ${value}`);

    console.log(`# explored configurations: ${root.compute_cardinality()} / ${2**items.length}`)
}

main();
