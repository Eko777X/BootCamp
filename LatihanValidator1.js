const readline = require('readline');
const validator = require('validator');
const fs = require('fs');




const rl = readline.createInterface
(
    {
        input: process.stdin,
        output: process.stdout
    }
);


rl.question('Siapa nama anda?', nama => 
    {
    console.log(`Halo, ${nama}!`);
    rl.question('Nomor Handphone?', noHp => 
        {
        console.log(`No Handhphone, ${noHp}!`);
        if (validator.isMobilePhone(noHp, 'id-ID'))
            {
                console.log(`No Handphone: , ${noHp},! Valid :`); 
            }
            else {console.log(`No Handphone: , ${noHp},! InValid :`);}
        rl.question('Alamat Email?', Email => 
            {
            if (validator.isEmail(Email))
                {
                    console.log(`Email: , ${Email},! Valid :`);
                }
                else {
                    console.log(`Email: , ${Email},! InValid :`);
                    }



        rl.close();
            })
     })
});