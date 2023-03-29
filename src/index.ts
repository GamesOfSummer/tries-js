import {
    consoleBuffer,
    consoleEnd,
    consoleStart,
    validateFxn,
} from './helpers.js';

import { CITY_NAMES } from './data.js';

const NO_ONE = 0;
const BY_A = 1;
const BY_B = 2;

interface Coordinate {
    closed: boolean;
    length: number;
    openedBy: number;
    x: number;
    y: number;
}

class Node {
    children: Node[];
    terminus: boolean;
    value: string;

    constructor(string) {
        this.children = [];
        this.terminus = false;
        this.value = string[0] || '';
        if (string.length > 1) {
            this.children.push(new Node(string.substr(1)));
        } else {
            this.terminus = true;
        }
    }

    add(data: string) {
        const value = data[0];
        const next = data.substr(1);

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            if (child.value === value) {
                if (next) {
                    child.add(next);
                } else {
                    child.terminus = true;
                }

                return;
            }
        }

        this.children.push(new Node(data));
    }
    complete(data: string) {
        let completions = [];

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            completions = completions.concat(
                child._childComplete(data, '', [])
            );
        }

        return completions;
    }

    _childComplete(search, built, suggestions) {
        if (suggestions.length >= 3 || (search && search[0] !== this.value)) {
            return suggestions;
        }

        if (this.terminus) {
            suggestions.push(`${built}${this.value}`);
        }

        this.children.forEach((child) =>
            child._childComplete(
                search.substr(1),
                `${built}${this.value}`,
                suggestions
            )
        );

        return suggestions;
    }
}

const createTrie = (words: string[]) => {
    const root = new Node('');

    for (let i = 0; i < words.length; i++) {
        const word: string = words[i];
        root.add(word.toLowerCase());
    }

    return root;
};

consoleStart();

const root = createTrie(CITY_NAMES.slice(0, 10));
const completions = root.complete('san');

validateFxn(completions.length, 3);

//   expect(completions.length).toBe(3);
//   expect(
//     _.intersection(completions, ["san antonio", "san diego", "san jose"])
//       .length
//   ).toBe(3);

consoleEnd();
consoleBuffer();

export {};
