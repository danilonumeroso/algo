type BBNode_Param = {
    cost: number;
    bound: number;
    weight: number;
    include: boolean;
    label: string;
    constraints: (x: BBNode) => boolean;
}

export class BBNode {

    public cost: number;
    public weight: number;
    public bound: number;
    public label: string;

    public parent: BBNode;
    private include: boolean;
    private children: BBNode[];
    private cumulative_weight: number;
    private cumulative_cost: number;
    private constraints: (x: BBNode) => boolean;

    public constructor(config: Partial<BBNode_Param>) {
        this.cost = config.cost;
        this.weight = config.weight;
        this.bound = config.bound;
        this.label = config.label ?? "";
        this.constraints = config.constraints ?? (_ => true);
        this.children = [];
        this.parent = null;
        this.include = config.include;
        this.cumulative_weight = config.weight;
        this.cumulative_cost = config.cost;
    }

    public add(... nodes: BBNode[]): void {

        const add_ = (node: BBNode, parent: BBNode) => {

            node.parent = parent;
            node.constraints = parent.constraints;

            const node_list = parent.upward_path()

            node.cumulative_cost = node_list.map(x => x.cost)
                .reduce((prev, curr) => prev + curr, node.is_included() ? node.cost : 0);

            node.cumulative_weight = node_list.map(x => x.weight)
                .reduce((prev, curr) => prev + curr, node.is_included() ? node.weight : 0);

            this.children.push(node);
        }

        for (const node of nodes) {
            add_(node, this);
        }
    }

    public is_feasible(): boolean {
        return this.constraints(this);
    }

    public tot_cost(): number {
        return this.cumulative_cost;
    }

    public tot_weight(): number {
        return this.cumulative_weight;
    }

    public is_included(): boolean {
        return this.include;
    }

    public level(): number {

        // Assumes a dummy root
        if (this.parent == null) {
            return -1;
        }

        return this.parent.level() + 1;
    }

    public is_leaf(): boolean {
        return this.children.length === 0;
    }

    public get_children(): Readonly<BBNode[]> {
        return this.children;
    }

    public upward_path(): BBNode[] {

        function upward_(node: BBNode, sol: BBNode[]): BBNode[] {

            // Assumes a dummy root
            if (node.parent === null) {
                return sol;
            }

            if (node.is_included()) {
                sol.push(node);
            }

            return upward_(node.parent, sol);

        }

        return upward_(this, []);
    }

    public compute_cardinality(): number {

        function cardinality_(node: BBNode): number {
            if (node.is_leaf()) {
                return 1;
            }

            let res = 0;
            for (const child of node.children) {
                res += cardinality_(child);
            }

            return res
        }

        return cardinality_(this);

    }
}

export type BB_Param = {
    dummy_root: BBNode;
    n_vars: number;
    branch: (branch: BBNode, ...args: any[]) => BBNode[];
    branch_args?: any[];
    bound: (branch: BBNode, ...args: any[]) => number;
    bound_args?: any[];
}


export function branch_and_bound(config: BB_Param): [BBNode, number, BBNode[]] {

    let branch_args = config.branch_args ?? [];
    let bound_args = config.bound_args ?? [];
    let queue = [config.dummy_root];
    let upper: number = -Infinity;
    let solution: BBNode[] = [];

    while (queue.length > 0) {
        let current_branch: BBNode = queue.shift();

        /*
          *Branch*
          Split the search space according to a branch policy.
         */
        let branches: BBNode[] = config.branch(current_branch, ...branch_args);

        current_branch.add(...branches);

        const max_branch = branches.filter(b => b.is_feasible())
            .reduce((b1, b2) => b1.tot_cost() > b2.tot_cost() ? b1 : b2);

        if (max_branch.tot_cost() > upper) {
            upper = max_branch.tot_cost();
            solution = max_branch.upward_path();
        }

        /*
          *Bound*
          Compute a bound for each feasible split. In case branch.bound is lower than the current upper bound,
          its subtree can not contain the optimal solution and will not be included in the queue for
          further considerations, i.e. first filter condition.

          Also, note that branches will not be enqueued in case no subsequent branches would be possible, i.e.
          second filter condition.
        */
        for (const branch of branches) {
            branch.bound = config.bound(branch, ...bound_args);
        }

        queue.push(
            ...branches
                .filter(b => b.bound > upper)
                .filter(b => b.level() !== config.n_vars - 1)
        )
    }

    return [config.dummy_root, upper, solution]
}
