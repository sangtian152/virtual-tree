<template>
<div>
    <vl-tree ref="tree" :data="tree" :default-expanded-keys="expandedKeys" />
</div>
</template>
<script>
export default {
    data() {
        return {
            tree: [],
            expandedKeys: ['node-1']
        }
    },
    created() {
        this.tree = this.createData(4, 30, 40)
    },
    mounted() {
        console.log('mounted')
    },
    methods: {
        getKey (prefix, id) {
            return `${prefix}-${id}`
        },
        createData (
            maxDeep,
            maxChildren,
            minNodesNumber,
            deep = 1,
            key = 'node'
        ) {
            let id = 0
            return Array.from({ length: minNodesNumber })
                .fill(deep)
                .map(() => {
                const childrenNumber =
                    deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
                const nodeKey = this.getKey(key, ++id)
                return {
                    id: nodeKey,
                    label: nodeKey,
                    children: childrenNumber
                    ? this.createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
                    : undefined,
                }
                })
            }
    }
}
</script>