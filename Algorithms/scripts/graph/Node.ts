module Algorithms {
    export class Node {
        public name: string;
        public value: string;
        public label: string;
        public order: number;

        constructor(name: string);
        constructor(name: string, value: string, label: string);
        constructor(name: string, value: string, label: string, order: number);
        constructor(name: string, value?: string, label?: string, order?: number) {
            this.name = name;
            this.value = value || name;
            this.label = label || name;
            this.order = order || null;
        }   
    }
}