class Generation {
  constructor(ancestors, populationCount, generation, mutationRate) {
    this.mutationRate = mutationRate;
    this.population = [];
    this.populationCount = populationCount;
    this.generation = generation;
    this.trainingCount = 0;

    if (!ancestors) {
      for (var i = 0; i < populationCount; i++) {
        this.population.push(
          new Learing(null, getActions(), 0.1, 0.1, 0.9, getStates())
        );
      }
    }
  }

  newGeneration(ancestors) {
    this.generation++;
    this.population = [];
    for (var i = 0; i < this.populationCount; i++) {
      var ancestor = ancestors[Math.floor(Math.random() * ancestors.length)];
      var mutation = this.mutate(ancestor, this.mutationRate);
      this.population.push(
        new Learing(
          ancestor.states,
          ancestor.actions,
          ancestor.epsilon,
          ancestor.alpha,
          ancestor.gamma,
          mutation
        )
      );
    }
  }
  mutate(ancestor, mutationRate) {
    var table = ancestor.qTable;

    for (const state in table) {
      for (const action in table[state]) {
        if (Math.random() < mutationRate) {
          table[state][action] = Math.random() * 2 - 1;
        }
      }
    }

    return table;
  }
  async trainGeneration() {
    for (var i = 0; i < this.populationCount; i++) {
      var learningAgent = this.population[i];
      await this.executeGeneration(learningAgent);
    }
  }

  executeGeneration(learningAgent) {
    return new Promise((resolve, reject) => {
      clockInterval = setInterval(() => {
        var state = getState();
        var action = learningAgent.chooseAction(state);
        execute(action);
        executeClock();

        if (checkColision()) {
          learningAgent.reward = point;
          reset();
          clockInterval = clearInterval(clockInterval);
          resolve(true);
        }
      }, 1);
    });
  }

  clock(learningAgent) {
    return new Promise((resolve, reject) => {
      var state = getState();
      var action = learningAgent.chooseAction(state);
      execute(action);
      executeClock();

      if (checkColision()) {
        learningAgent.reward = point;
        reset();

        clockInterval = clearInterval(clockInterval);
        resolve(true);
      }
      reject();
    });
  }

  async train(count) {
	this.trainingCount = 0;
    while (this.trainingCount < count) {
      var populationCount = this.population.length;
      var population = this.population.slice();

      population = population.sort((a, b) => {
        return a.reward - b.reward;
      });

      for (var i = populationCount; i > populationCount / 2; i--) {
        population.pop();
      }

	  if (population.length == 0) {
		this.newGeneration([new Learing(null, getActions(), 0.1, 0.1, 0.9, getStates())]);
	  }else{
		  this.newGeneration(population);
	  }

      await this.trainGeneration();
      this.trainingCount++;
    }
  }
}

class Learing {
  constructor(states, actions, epsilon, alpha, gamma, qTable = null) {
    this.qTable = qTable || {};
    this.epsilon = epsilon;
    this.alpha = alpha;
    this.gamma = gamma;
    this.actions = actions;
    this.states = states;
    this.reward = 0;

    if (!qTable) {
      for (var state in states) {
        this.qTable[state] = {};
        for (var action in actions) {
          this.qTable[state][action] = 0;
        }
      }
    }
  }
  chooseAction(state) {
    if (Math.random() < this.epsilon) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else {
      return this.maxAction(state);
    }
  }
  maxAction(state) {
    var state = this.qTable[state];
    var maxValue = Math.max(...Object.values(state));
    return Object.keys(state).find((key) => state[key] === maxValue);
  }

  updateValue(state, action, reward, nextState) {
    var state = this.qTable[state];
    var nextState = this.qTable[nextState];
    var value = state[action];
    var maxNext = Math.max(...Object.values(nextState));

    var newValue = value + this.alpha * (reward + this.gamma * maxNext - value);
    this.qTable[state][action] = newValue;
  }
}

const descriptions = ["very close", "close", "medium", "far"];
function getNormalizedDistaceDescription(normalizeDistace) {
  return descriptions[normalizeDistace];
}
function normalizeDistace(distance) {
  // Normalize the distance into features

  if (distance < 10) {
    return 0;
  } else if (distance < 15) {
    return 1;
  } else if (distance < 20) {
    return 2;
  } else {
    return 3;
  }
}

function getStates() {
  var states = {};







//   for (var a = 0; a < descriptions.length; a++) {
//     for (var b = 0; b < descriptions.length; b++) {
//       for (var i = 0; i < descriptions.length; i++) {
//         for (var j = 0; j < descriptions.length; j++) {
          for (var k = 0; k < descriptions.length; k++) {
            for (var l = 0; l < descriptions.length; l++) {
              for (var n = 0; n < descriptions.length; n++) {
                for (var m = 0; m < descriptions.length; m++) {
                //   states[[i] + [j] + [k] + [l] + [n] + [m] + [a] + [b]] = {
                  states[[k] + [l] + [n] + [m]] = {
                    left: Math.random() * 2 - 1,
                    right: Math.random() * 2 - 1,
                  };
                }
              }
            }
          }
        // }
//       }
//     }
//   }

  return states;
}

function getActions() {
  return ["left", "right"];
}

function execute(action) {
  if (action == "left") {
    car.move("left");
  } else {
    car.move("right");
  }
}

function getState() {
  var sensors = car.getSensorsDistance();
  var state = "";

  for (var i = 0; i < sensors.length; i++) {
    state += normalizeDistace(sensors[i]);
  }

  return state;
}

var generation = new Generation(null, 10, 0, 0.001);
