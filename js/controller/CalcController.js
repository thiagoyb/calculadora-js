class CalcController{

        constructor(){
            this._lastOperator = '';
            this._lastNumber = '';
            this._typedText = [];
            this._locale='pt-BR';
            this._dateEl = document.querySelector('#data');
            this._hourEl = document.querySelector('#hora');
            this._displayEl = document.querySelector('#display');
            this._curDate;
            this.init();
            this.initButtonsEvents();
            this.initKeyBoard();
        }

        pasteFromClipboard(){
            document.addEventListener('paste', event=>{
                let pasteText = event.clipboardData.getData('Text');
                this.addDigit(parseFloat(pasteText.replace(',','.')));
            });
        }

        copyToClipboard(){
            let input = document.createElement("INPUT");
            input.value = this._typedText;
            document.body.appendChild(input);
            input.focus();
            input.select();
            document.execCommand("Copy");
            input.remove();
        }

        init(){
            this.updateDisplay();

            this.setDisplayDateTime();
            setInterval(()=>{
                this.setDisplayDateTime();
            }, 1000);

            this.pasteFromClipboard();
        }

        addEvents(element, events, fn){
            events.split(' ').forEach(event =>{
                element.addEventListener(event, fn, false);
            });
        }

        clearAll(){
            this._typedText = [];
            this._lastNumber = '';
            this._lastOperator = '';
            this.updateDisplay();
            console.log(this._typedText);
        }
        clearEntry(){
            return this._typedText.pop();
        }
        setError(){
            this.displayCalc ='Error';
        }

        updateDisplay(){
            if(this._typedText.length<=0){
                this.displayCalc = 0;
            } else{ // Se dar CE e o array so tem um elemento, poe 0 no visor
                this.displayCalc = this._typedText.join('');
            }
        }

        getLastItem(isOperator = true){
            for(let i = this._typedText.length-1; i>=0; i--){
                if(this.isOperator(this._typedText[i]) == isOperator){ return this._typedText[i]; }
            }
            return '';
        }

        getLast(){
            return this._typedText.length>0 ? this._typedText[this._typedText.length-1] : '';
        }

        isOperator(val){
            let operators = ['+','-','*','/','%'];
            return operators.indexOf(val)>-1;
        }

        pushOperation(val){
            this._typedText.push(val);
            
            if(this._typedText.length>3){
                this.calc();
            }

            this.updateDisplay();
        }
        calc(){//05/12/2021
            let lastVal = this._typedText.length>3 ? this.clearEntry() : '';
            if(lastVal=='%'){
                let last2nd = this.clearEntry();
                let percent  = eval(parseFloat(last2nd) * parseFloat(this._typedText[0]) /100);
                this._typedText.push(parseFloat(percent.toFixed(11)));
            } else{
                if(this._typedText.length==3){
                    let result = eval(this._typedText.join('').trim());
                    this._lastOperator = lastVal!='' ? lastVal : this.getLastItem();
                    this._lastNumber = lastVal!='' ? result : this.getLastItem(false);

                    this._typedText = [parseFloat(result.toFixed(11))];
                    if(lastVal!=''){
                        this._typedText.push(lastVal);
                    }
                } else{
                    let firstItem = this._typedText[0];
                    this._typedText = [firstItem, this._lastOperator, this._lastNumber];
                    this._typedText = [eval(this._typedText.join('').trim())];
                }
            }
            this.updateDisplay();
            console.log(this._typedText);
        }
        
        addOperation(val){
            if(this._typedText.length==0){ this.addDigit(0); }

            if(this.isOperator(val)){//se array vazio e poe operador, poe 0 antes
                if(this.isOperator(this.getLast())){
                    this.clearEntry();
                }   //Se last eh operation remove acima e substitui abaixo, ou simpl. add new item
                this.pushOperation(val);
            } else{//.
                let lastVal = this.clearEntry();

                if(this.isOperator(lastVal)){
                    this._typedText.push(lastVal);
                    this.pushOperation('0.');
                } else{
                    if(lastVal.toString().split('').indexOf('.')>-1){
                        this._typedText.push(lastVal);
                        return;
                    }
                    let newVal = lastVal.toString() + '.';
                    this.pushOperation(newVal);
                }
            }
            console.log(this._typedText);
        }
        addDigit(val){//OK 05/12/21
            let lastDigit = this.getLast();
            if(lastDigit!==''){
                if(isNaN(lastDigit)){
                    this.pushOperation(val);
                } else{     // se array so tem um 0 e digita um numero nao concatena com 0;
                    let newVal = lastDigit===0 ? val : lastDigit.toString() + '' + val.toString();
                    this.clearEntry();
                    this.pushOperation(newVal);//Para permitir 0 a esq. depois do . nao converter
                }
            } else{
                this.pushOperation(val);
            }
            console.log(this._typedText);
        }

        execBtn(val){
            switch(val){
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':{
                   this.addDigit(parseInt(val));
                   break;
                }
                case 'ac':{
                    this.clearAll();
                    break;
                }
                case 'ce':{
                    this.clearEntry()
                    this.updateDisplay();
                    console.log(this._typedText);
                    break;
                }
                case 'soma':{
                    this.addOperation('+');
                    break;
                }
                case 'subtracao':{
                    this.addOperation('-');
                    break;
                }
                case 'multiplicacao':{
                    this.addOperation('*');
                    break;
                }
                case 'divisao':{
                    this.addOperation('/');
                    break;
                }
                case 'porcento':{
                    this.addOperation('%');
                    break;
                }
                case 'igual':{
                    this.calc();
                    break;
                }
                case 'ponto':{
                    this.addOperation('.');
                    break;
                }
                default:{
                    this.setError();
                    break;
                }
            }
        }

        initKeyBoard(){
            document.addEventListener('keyup', event =>{
                switch(event.key){
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '0':{
                        this.addDigit(parseInt(event.key));
                        break;
                    }
                    case 'Escape':{
                        this.clearAll();
                        break;
                    }
                    case 'Backspace':{
                        this.clearEntry()
                        this.updateDisplay();
                        console.log(this._typedText);
                        break;
                    }
                    case '+':{
                        this.addOperation('+');
                        break;
                    }
                    case '-':{
                        this.addOperation('-');
                        break;
                    }
                    case '*':{
                        this.addOperation('*');
                        break;
                    }
                    case '/':{
                        this.addOperation('/');
                        break;
                    }
                    case '%':{
                        this.addOperation('%');
                        break;
                    }
                    case '=':
                    case 'Enter':{
                        this.calc();
                        break;
                    }
                    case '.':
                    case ',':{
                        this.addOperation('.');
                        break;
                    }
                    case 'c':{
                        if(event.ctrlKey) this.copyToClipboard();
                        break;
                    }
                    default:{ console.log('Key: ', event.key); }
                }
            });
        }

        initButtonsEvents(){
            let btns = document.querySelectorAll('#buttons > g, #texts > g');

            btns.forEach(btn =>{
                let textBtn = btn.className.baseVal.replace('btn-','');
                //btn.setAttribute('title', textBtn);

                this.addEvents(btn,'click drag drop', (e)=>{
                    this.execBtn(textBtn);
                });

                this.addEvents(btn,'mouseup mousedown mouseover', (e)=>{
                   btn.style.cursor = 'pointer';
                });
            });
        }

        stripZeros(val){
            return parseFloat(val.replace(',','.')).toString().replace('.',',');
        }

        get displayTime(){
            return this._hourEl.innerHTML;
        }
        set displayTime(val){
            this._hourEl.innerHTML = val;
        }

        get displayDate(){
            return this._dateEl.innerHTML;
        }
        set displayDate(val){
            this._dateEl.innerHTML = val;
        }

        get displayCalc(){
            return this._displayEl.innerHTML;
        }
        set displayCalc(val){
            this._displayEl.innerHTML = val;
        }

        get curDate(){
            return new Date();
        }

        setDisplayDateTime(){
            this.displayDate = this.curDate.toLocaleDateString(this._locale, {
                day: '2-digit',
                month:'long',
                year: 'numeric',
            });
            this.displayTime = this.curDate.toLocaleTimeString(this._locale);
        }
    
}