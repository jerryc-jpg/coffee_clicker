/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
    const coffee = document.getElementById("big_coffee");
    const counter = document.getElementById("coffee_counter");
  
    counter.innerText = coffeeQty;
  }
  
  function clickCoffee(data) {
    data.coffee++;
    updateCoffeeView(data.coffee);
    renderProducers(data);
  }
  
  /**************
   *   SLICE 2
   **************/
  
  function unlockProducers(producers, coffeeCount) {
    producers.forEach((producer) => {
      if (coffeeCount >= producer.price / 2) {
        producer.unlocked = true;
      }
    });
  }
  
  function getUnlockedProducers(data) {
    const unlockedProducers = [];
    data.producers.forEach((producer) => {
      if (producer.unlocked === true) {
        unlockedProducers.push(producer);
      }
    });
    return unlockedProducers;
  }
  
  function makeDisplayNameFromId(id) {
    const splitId = id.split("_");
    const newId = [];
    for (let i = 0; i < splitId.length; i++) {
      const word = splitId[i].charAt(0).toUpperCase() + splitId[i].slice(1);
      newId.push(word);
    }
    return newId.join(" ");
  }
  

  function makeProducerDiv(producer) {
    const containerDiv = document.createElement("div");
    containerDiv.className = "producer";
    const displayName = makeDisplayNameFromId(producer.id);
    const currentCost = producer.price;
    const html = `
    <div class="producer-column">
      <div class="producer-title">${displayName}</div>
      <button type="button" id="buy_${producer.id}">Buy</button>
    </div>
    <div class="producer-column">
      <div>Quantity: ${producer.qty}</div>
      <div>Coffee/second: ${producer.cps}</div>
      <div>Cost: ${currentCost} coffee</div>
    </div>
    `;
    containerDiv.innerHTML = html;
    return containerDiv;
  }
  
  function deleteAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  
  function renderProducers(data) {
    const producerContainer = document.getElementById("producer_container");
    deleteAllChildNodes(producerContainer);
    unlockProducers(data.producers, data.coffee);
    const unlockedProducers = getUnlockedProducers(data);
    unlockedProducers.forEach((producer) => {
      producerContainer.appendChild(makeProducerDiv(producer));
    });
  }
  
  /**************
   *   SLICE 3
   **************/
  
  function getProducerById(data, producerId) {
    const producerArr = data.producers;
    return producerArr.filter((producer) => producer.id === producerId)[0];
  }
  
  function canAffordProducer(data, producerId) {
    return data.coffee >= getProducerById(data, producerId).price ? true : false;
  }
  
  function updateCPSView(cps) {
    const cpsIndicator = document.getElementById("cps");
    cpsIndicator.innerText = cps;
  }
  
  function updatePrice(oldPrice) {
    return Math.floor(oldPrice * 1.25);
  }
  
  function attemptToBuyProducer(data, producerId) {
    if (canAffordProducer(data, producerId)) {
      const producer = getProducerById(data, producerId);
      producer.qty++;
      data.coffee -= producer.price;
      producer.price = updatePrice(producer.price);
      data.totalCPS += producer.cps;
      renderProducers(data);
      updateCPSView(data.totalCPS);
      updateCoffeeView(data.coffee);
      return true;
    }
    window.alert("Not enough Coffee!");
    return false;
  }
  
  function buyButtonClick(event, data) {
    if (event.target.tagName === "BUTTON") {
      const targetId = event.target.id.split("").slice(4).join("");
      attemptToBuyProducer(data, targetId);
    }
  }
  
  function tick(data) {
    data.coffee += data.totalCPS;
    updateCoffeeView(data.coffee);
    renderProducers(data);
  }
  
  if (typeof process === "undefined") {
    // Get starting data from the window object
    // (This comes from data.js)
    const data = window.data;
  
    // Add an event listener to the giant coffee emoji
    const bigCoffee = document.getElementById("big_coffee");
    bigCoffee.addEventListener("click", () => clickCoffee(data));
  
    // Add an event listener to the container that holds all of the producers
    // Pass in the browser event and our data object to the event listener
    const producerContainer = document.getElementById("producer_container");
    producerContainer.addEventListener("click", (event) => {
      buyButtonClick(event, data);
    });
  
    // Call the tick function passing in the data object once per second
    setInterval(() => tick(data), 1000);
  }
  
  else if (process) {
    module.exports = {
      updateCoffeeView,
      clickCoffee,
      unlockProducers,
      getUnlockedProducers,
      makeDisplayNameFromId,
      makeProducerDiv,
      deleteAllChildNodes,
      renderProducers,
      updateCPSView,
      getProducerById,
      canAffordProducer,
      updatePrice,
      attemptToBuyProducer,
      buyButtonClick,
      tick,
    };
  }