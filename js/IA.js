class Learing{
    constructor(states, actions, epsilon, alpha, gamma){
        this.qTable = {};
        this.epsilon = epsilon;
        this.alpha = alpha;
        this.gamma = gamma;
        this.actions = actions;
        this.states = states;
    }


    chooseAction(state){
        if(Math.random() < this.epsilon){
            return this.actions[Math.floor(Math.random() * this.actions.length)];
        }else{
            return maxAction(state);
        }

        function maxAction(state){
            var state = this.qTable[state];
            var maxValue = Math.max(...Object.values(state));
            return Object.keys(state).find(key => state[key] === maxValue);
        }
    }

    updateValue(state, action, reward, nextState){
        var state = this.qTable[state];
        var nextState = this.qTable[nextState];
        var value = state[action];
        var maxNext = Math.max(...Object.values(nextState));

        var newValue = value + this.alpha * (reward + this.gamma * maxNext - value);
        this.qTable[state][action] = newValue;
    }








}



