function vowelCount(input) {
const vowels = 'aeiou';
const counts = {
    a: 0,
    e: 0,
    i: 0,
    o: 0,
    u: 0,
};

// Normalize the input to lowercase
const normalizedInput = input.toLowerCase();

// Count occurrences of each vowel
for (let char of normalizedInput) {
    if (vowels.includes(char)) {
        counts[char]++;
    }
}

// Format the output
return `${counts.a}, ${counts.e}, ${counts.i}, ${counts.o}, and ${counts.u} appear, respectively, ${counts.a}, ${counts.e}, ${counts.i}, ${counts.o}, ${counts.u} times`;
}

// Example usage
console.log(vowelCount('Le Tour de France'));

