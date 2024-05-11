// Write a function that breaks words into strings and looks for pairs of those words that are anagrams of each other according to the first function
//         Example:
//          input: "listen silent earth heart hello world"
//          output: (listen, silent) (earth, heart)
export function solutionB(input:string):[string, string][] {
    // anaogram matches
    const matches:[string, string][] = [];

    // break string into words
    const words = input.split(' ');

    // iterate through words
    //      iterate through words
    //          compare
    //          append if true

    // for index to lengh of matches
    // worda = words[i]
    // wordb = words[length-i]
    // compare via solutionA(worda, wordb)
    // if true, append to matches
    // return matches;

    return matches;
}

// Write a function that determines if two strings are anagrams of one another.
// Example:
//  input: act, cat
//  output: are anagrams

export function solutionAa(a: string, b:string):boolean {
    const count = a.length

    console.log(count);

    for(let i=0; i < count; i++) {
        console.log(a[i], b[count-i-1]);
        if(a[i] == b[count-i-1]) {
            continue;
        }

        return false;
    }

    return true;
}

export function solutionA(a: string, b:string):boolean {
    // sanitize input

    const aSanitized = a.replace(' ', '');
    const bSanitized = b.replace(' ', '');

    // check length

    if(aSanitized.length != bSanitized.length) {
        return false;
    }

    // arrayify

    const aChars = aSanitized.split('');
    const bChars = bSanitized.split('');

    // sort chars

    const aCharsSorted = aChars.sort();
    const bCharsSorted = bChars.sort();

    // join chars

    const aSortedSring = aCharsSorted.join('');
    const bSortedString = bCharsSorted.join('');

    // check equality & return

    return aSortedSring == bSortedString;
}