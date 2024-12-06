// function hitung (a,b,c) {
//     const hasil = a+b;
//     c(hasil);
// };

// hitung (2,3,(hasil)=> {
//     console.log(`Hasil penjumlahan: ${hasil}`);
// });


// function greeting(name, callback){
//     callback(`Hello, ${name}`);
// }
// greeting("Alice", message =>{
//     console.log(message);
// });


// const sum = (a,b) => {
//     return a+b
// };

// console.log(sum(5,3));

const str = async (a) => {
    return new Promise ((resolve,rejected) => {a ? resolve(a.length) : rejected("Invalid")

    });
};

const run = async () => {
    try {
        const result = await str("Monyet");
        console.log(result);  // Output panjang string "Monyet"
    } catch (err) {
        console.log(err);  // Menangani error jika input tidak valid
    }
};

run();
