class CalcController{

        constructor(){
            this._typedText = [];
            this._locale='pt-BR';
            this._dateEl = document.querySelector('#data');
            this._hourEl = document.querySelector('#hora');
            this._displayEl = document.querySelector('#display');
            this._curDate;
            this.init();
            this.initButtonsEvents();
        }

        init(){
            this.updateDisplay();

            this.setDisplayDateTime();
            setInterval(()=>{
                this.setDisplayDateTime();
            }, 1000);

        }

        addEvents(element, events, fn){
            events.split(' ').forEach(event =>{
                element.addEventListener(event, fn, false);
            });
        }

        clearAll(){
            this._typedText = [];
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
        calc(){
            let lastVal = this._typedText.length>3 ? this.clearEntry() : '';
            if(lastVal=='%'){
                let last2nd = this.clearEntry();
                let percent  = eval(parseFloat(last2nd) * parseFloat(this._typedText[0]) /100);
                this._typedText.push(percent);
            } else{
                if(this._typedText.length==3){
                    this._typedText = [ eval(this._typedText.join('').trim()) ];
                    if(lastVal!=''){
                        this._typedText.push(lastVal);
                    }
                }
            }
            this.updateDisplay();
            console.log(this._typedText);
        }
        
        addOperation(val){
            if(this.isOperator(val)){//se array vazio e poe operador, poe 0 antes
                if(this._typedText.length==0){ this.addDigit(0); }

                if(this.isOperator(this.getLast())){
                    this.clearEntry();
                }   //Se last eh operation remove acima e substitui abaixo, ou simpl. add new item
                this.pushOperation(val);
            } else{
                this.pushOperation(val);
                //.
            }
            console.log(this._typedText);
        }
        addDigit(val){//OK 04/12/21
            let lastDigit = this.getLast();
            if(lastDigit!==''){
                if(isNaN(lastDigit)){
                    this.pushOperation(val);
                } else{     // se array so tem um 0 e digita um numero nao concatena com 0;
                    let newVal = lastDigit===0 ? val : lastDigit.toString() + '' + val.toString();
                    this.clearEntry();
                    this.pushOperation(parseInt(newVal));
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