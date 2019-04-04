import warning from 'warning';

const SO_CASCADER_NAV = 'SO_CASCADER_NAV';

function initWrapper(wrapper) {
    return {
        ...wrapper,
        valueEntities: {},
    };
}

function processEntity(entity, wrapper) {
    const { value, label } = entity.node;
    entity.value = value;
    entity.label = label;

    // This should be empty, or will get error message.
    const currentEntity = wrapper.valueEntities[value];
    if (currentEntity) {
        warning(false, `Conflict! do not use same value.`);
    }
    wrapper.valueEntities[value] = entity;
}

export function getPosition(level, index) {
    return `${level}-${index}`;
}

export function traverseCascaderOptions(options, callback) {
    function processOption(node, index, parent) {
        const children = node ? node.children : options;
        const pos = node ? getPosition(parent.pos, index) : 0;

        if (node) {
            const data = {
                node,
                index,
                pos,
                parentPos: parent.node ? parent.pos : null,
            };

            callback(data);
        }

        children &&
            children.forEach((subChildren, subIndex) => {
                processOption(subChildren, subIndex, { node, pos });
            });
    }

    processOption(null);
}

export function soConvertOptionToEntities(
    options,
    { initWrapper, processEntity } = {}
) {
    const posEntities = {};

    let wrapper = {
        posEntities,
    };

    if (initWrapper) {
        wrapper = initWrapper(wrapper) || wrapper;
    }

    traverseCascaderOptions(options, item => {
        const { node, index, pos, parentPos } = item;
        const entity = { node, index, pos };

        posEntities[pos] = entity;

        // Fill children
        entity.parent = posEntities[parentPos];
        if (entity.parent) {
            entity.parent.children = entity.parent.children || [];
            entity.parent.children.push(entity);
        }

        if (processEntity) {
            // 收集 valueEntities
            processEntity(entity, wrapper);
        }
    });

    return wrapper;
}

export function convertOptionToEntities(options) {
    return soConvertOptionToEntities(options, { initWrapper, processEntity });
}

export function genrateValueListTree(valueList, valueEntities) {
    let valueListTree = [];
    // let init = false;

    function traverseValueList(valueList) {
        const posRelate = {};
        const newValueList = [];

        valueList.forEach(valueItem => {
            const entity = valueEntities[valueItem.value];
            if (!entity) return;

            const { parent } = entity;
            if (parent) {
                const { pos, label, value } = parent;

                delete valueItem.parent;

                if (posRelate[pos]) {
                    posRelate[pos].children.push(valueItem);
                } else {
                    const grandparent = parent.parent;
                    let newGrandparent;
                    if (grandparent) {
                        newGrandparent = {
                            label: grandparent.label,
                            value: grandparent.value,
                            pos: grandparent.pos,
                        };
                    }
                    posRelate[pos] = {};
                    posRelate[pos].label = label;
                    posRelate[pos].value = value;
                    posRelate[pos].parent = newGrandparent;
                    posRelate[pos].children = [valueItem];
                    newValueList.push(posRelate[pos]);
                }
            } else {
                delete valueItem.parent;
                valueListTree.push(valueItem);
            }
        });

        if (newValueList.length) {
            traverseValueList(newValueList);
        }
    }

    traverseValueList(valueList);
    return valueListTree;
}

// 规范header
export function formatHeaders(headers) {
    return headers.map(header => {
        if (typeof header === 'string') {
            return {
                title: header,
            };
        } else {
            return header;
        }
    });
}

export function orderOptionsByLetter(options, letter) {
    const result = options.reduce((pre, next) => {
        if (!pre[next[letter]]) pre[next[letter]] = [];

        pre[next[letter]].push(next);

        return pre;
    }, {});

    const letters = Object.keys(result);

    const nextOptions = letters.reduce((pre, next) => {
        pre.push({
            label: next,
            value: SO_CASCADER_NAV + '_' + next,
            disabled: true,
            isNavFieldItem: true,
            // isLeaf: true,
        });

        return [...pre, ...result[next]];
    }, []);

    return [letters, nextOptions];
}
