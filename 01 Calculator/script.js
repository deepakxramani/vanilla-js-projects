let string = "";
let buttons = document.querySelectorAll('.button');
let inputEl = document.querySelector('input');
inputEl.value = 0;
var updatedValue = inputEl.value

Array.from(buttons).forEach((button)=>{
    button.addEventListener('click',(e)=>{
        if(e.target.innerHTML == '=')
        {
            string = eval(string);
            document.querySelector('input').value = string;
        }
        else if(e.target.innerHTML == 'C' )
        {   string = "";
            document.querySelector('input').value = updatedValue;
        }
        else{
        console.log(e.target)
        string = string + e.target.innerHTML;
        document.querySelector('input').value = string
        }
        
    })
})