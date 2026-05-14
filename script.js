// ========================
// script.js — Lógica completa de la calculadora
// Botones: AC (borrar todo), ← (borrar 1 carácter), % y operaciones
// ========================

(function() {
    // Elementos del DOM
    const previousOperandEl = document.getElementById('previousOperand');
    const currentOperandEl = document.getElementById('currentOperand');

    // Estado de la calculadora
    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let waitingForOperand = false;
    let justEvaluated = false;

    // Actualizar la interfaz
    function updateDisplay() {
        let displayValue = currentOperand;
        if (typeof displayValue === 'number') {
            if (Number.isFinite(displayValue)) {
                displayValue = parseFloat(displayValue.toFixed(8)).toString();
            } else {
                displayValue = 'Error';
            }
        }
        currentOperandEl.innerText = displayValue === '' ? '0' : displayValue;
        
        // Mostrar operación previa
        if (operation && previousOperand !== '' && !waitingForOperand) {
            let prev = previousOperand;
            if (typeof prev === 'number') prev = parseFloat(prev.toFixed(8)).toString();
            let opSymbol = '';
            switch (operation) {
                case 'add': opSymbol = '+'; break;
                case 'subtract': opSymbol = '-'; break;
                case 'multiply': opSymbol = '×'; break;
                case 'divide': opSymbol = '÷'; break;
                case 'percent': opSymbol = '%'; break;
                default: opSymbol = '';
            }
            previousOperandEl.innerText = `${prev} ${opSymbol}`;
        } else if (previousOperand !== '' && !operation && !waitingForOperand) {
            previousOperandEl.innerText = previousOperand;
        } else {
            if (previousOperand !== '' && waitingForOperand && operation) {
                let opSymbol = '';
                switch (operation) {
                    case 'add': opSymbol = '+'; break;
                    case 'subtract': opSymbol = '-'; break;
                    case 'multiply': opSymbol = '×'; break;
                    case 'divide': opSymbol = '÷'; break;
                    case 'percent': opSymbol = '%'; break;
                }
                previousOperandEl.innerText = `${previousOperand} ${opSymbol}`;
            } else {
                previousOperandEl.innerText = '';
            }
        }
        if (currentOperand === 'Error') currentOperandEl.innerText = 'Error';
    }

    // Borrar todo (AC)
    function allClear() {
        currentOperand = '0';
        previousOperand = '';
        operation = null;
        waitingForOperand = false;
        justEvaluated = false;
        updateDisplay();
    }

    // Borrar un carácter (←)
    function deleteLastChar() {
        if (justEvaluated) {
            allClear();
            return;
        }
        if (waitingForOperand) return;
        if (currentOperand === 'Error') {
            allClear();
            return;
        }
        if (currentOperand.length === 1 || (currentOperand === '0')) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
            if (currentOperand === '') currentOperand = '0';
        }
        updateDisplay();
    }

    // Ingresar número o punto decimal
    function inputNumber(number) {
        if (justEvaluated) {
            currentOperand = '0';
            justEvaluated = false;
            waitingForOperand = false;
            operation = null;
            previousOperand = '';
        }
        
        if (waitingForOperand) {
            currentOperand = '0';
            waitingForOperand = false;
            justEvaluated = false;
        }
        
        if (number === '.') {
            if (currentOperand.includes('.')) return;
            if (currentOperand === '' || currentOperand === '0') {
                currentOperand = '0.';
                updateDisplay();
                return;
            }
            currentOperand += '.';
            updateDisplay();
            return;
        }
        
        const numStr = number.toString();
        if (currentOperand === '0' && numStr !== '.') {
            currentOperand = numStr;
        } else {
            currentOperand += numStr;
        }
        if (currentOperand.length > 16) {
            currentOperand = currentOperand.slice(0, 16);
        }
        updateDisplay();
    }

    // Cálculo matemático
    function calculate(a, b, op) {
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);
        if (isNaN(num1) || isNaN(num2)) return 'Error';
        
        switch (op) {
            case 'add': return num1 + num2;
            case 'subtract': return num1 - num2;
            case 'multiply': return num1 * num2;
            case 'divide':
                if (num2 === 0) return 'Error';
                return num1 / num2;
            case 'percent':
                if (previousOperand !== '' && operation && !waitingForOperand) {
                    const base = parseFloat(previousOperand);
                    return (base * num2) / 100;
                } else {
                    return num2 / 100;
                }
            default:
                return 'Error';
        }
    }

    // Elegir operador
    function chooseOperator(op) {
        if (currentOperand === 'Error') {
            allClear();
            return;
        }
        
        if (justEvaluated) {
            previousOperand = currentOperand;
            operation = op;
            waitingForOperand = true;
            justEvaluated = false;
            updateDisplay();
            return;
        }
        
        if (operation === null || previousOperand === '') {
            if (currentOperand !== '') {
                previousOperand = currentOperand;
                operation = op;
                waitingForOperand = true;
                updateDisplay();
                return;
            }
            return;
        }
        
        if (!waitingForOperand && operation !== null && previousOperand !== '') {
            let result = calculate(previousOperand, currentOperand, operation);
            if (result === 'Error') {
                currentOperand = 'Error';
                previousOperand = '';
                operation = null;
                waitingForOperand = false;
                updateDisplay();
                return;
            }
            if (typeof result === 'number' && !Number.isInteger(result)) {
                result = parseFloat(result.toFixed(8));
            }
            previousOperand = result.toString();
            currentOperand = result.toString();
            operation = op;
            waitingForOperand = true;
            updateDisplay();
        } else if (waitingForOperand) {
            operation = op;
            updateDisplay();
        }
    }

    // Evaluar resultado (=)
    function evaluate() {
        if (currentOperand === 'Error') {
            allClear();
            return;
        }
        
        if (operation === null || previousOperand === '') {
            justEvaluated = true;
            waitingForOperand = false;
            updateDisplay();
            return;
        }
        
        let secondOperand = currentOperand;
        if (waitingForOperand) {
            secondOperand = currentOperand;
        }
        
        let result = calculate(previousOperand, secondOperand, operation);
        
        if (result === 'Error') {
            currentOperand = 'Error';
            previousOperand = '';
            operation = null;
            waitingForOperand = false;
            justEvaluated = true;
            updateDisplay();
            return;
        }
        
        if (typeof result === 'number') {
            if (!Number.isFinite(result)) {
                currentOperand = 'Error';
                updateDisplay();
                return;
            }
            result = parseFloat(result.toFixed(8));
            currentOperand = result.toString();
        } else {
            currentOperand = result.toString();
        }
        
        previousOperand = '';
        operation = null;
        waitingForOperand = false;
        justEvaluated = true;
        updateDisplay();
    }

    // Manejador de clics
    function handleButtonClick(event) {
        const button = event.currentTarget;
        
        if (button.hasAttribute('data-number')) {
            const number = button.getAttribute('data-number');
            inputNumber(number);
        }
        else if (button.hasAttribute('data-op')) {
            const op = button.getAttribute('data-op');
            let mappedOp = '';
            switch (op) {
                case 'add': mappedOp = 'add'; break;
                case 'subtract': mappedOp = 'subtract'; break;
                case 'multiply': mappedOp = 'multiply'; break;
                case 'divide': mappedOp = 'divide'; break;
                case 'percent': mappedOp = 'percent'; break;
                default: return;
            }
            chooseOperator(mappedOp);
        }
        else if (button.hasAttribute('data-action')) {
            const action = button.getAttribute('data-action');
            if (action === 'clear') {
                allClear();
            } else if (action === 'delete') {
                deleteLastChar();
            } else if (action === 'equals') {
                evaluate();
            }
        }
    }
    
    // Asignar eventos a todos los botones
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        btn.addEventListener('click', handleButtonClick);
    });
    
    // Inicializar
    updateDisplay();
    
    // Soporte para teclado
    window.addEventListener('keydown', (e) => {
        const key = e.key;
        const validKeys = ['0','1','2','3','4','5','6','7','8','9','.', '+', '-', '*', '/', '%', 'Enter', '=', 'Escape', 'Delete', 'Backspace'];
        if (validKeys.includes(key)) {
            e.preventDefault();
        }
        if (key >= '0' && key <= '9') {
            inputNumber(key);
        } else if (key === '.') {
            inputNumber('.');
        } else if (key === '+') {
            chooseOperator('add');
        } else if (key === '-') {
            chooseOperator('subtract');
        } else if (key === '*') {
            chooseOperator('multiply');
        } else if (key === '/') {
            chooseOperator('divide');
        } else if (key === '%') {
            chooseOperator('percent');
        } else if (key === 'Enter' || key === '=') {
            evaluate();
        } else if (key === 'Escape' || key === 'Delete') {
            allClear();
        } else if (key === 'Backspace') {
            deleteLastChar();
        }
    });
})();
