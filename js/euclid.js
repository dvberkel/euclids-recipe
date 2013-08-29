var euclid = (function(){
    var euclid = {};

    var NumberModel = euclid.NumberModel = function NumberModel(n){
	this.set = function set(number){
	    n = number || 1;
	    this.notify();
	}
	this.get = function get(){
	    return n;
	}
    };
    NumberModel.prototype.observers = function observers(){
	if (!this._observers) {
	    this._observers = [];
	}
	return this._observers;
    };
    NumberModel.prototype.addObserver = function addObserver(observer){
	this.observers().push(observer);
    };
    NumberModel.prototype.notify = function notify(){
	var observers = this.observers();
	for (var index = 0; index < observers.length; index++){
	    var observer = observers[index];
	    observer.call(null, this);
	}
    };

    var NumberView = euclid.NumberView = function NumberView(model, containerId) {
	var self = this;
	self.model = model;
	self.containerId = containerId;
	self.update();
	self.model.addObserver(function(){ self.update() });
    };
    NumberView.prototype.getContainer = function getContainer(){
	if (!this.container) {
	    this.container = document.getElementById(this.containerId);
	}
	return this.container;
    };
    NumberView.prototype.update = function update(){
	var container = this.getContainer();
	container.textContent = this.model.get();
    };

    var GcdModel = euclid.GcdModel = function GcdModel(aModel, bModel){
	this.aModel = aModel;
	this.bModel = bModel;
    };
    GcdModel.prototype.a = function a(){
	return this.aModel.get();
    };
    GcdModel.prototype.b = function b(){
	return this.bModel.get();
    };

    var GcdView = euclid.GcdView = function GcdView(model, containerId){
	this.model = model;
	this.containerId = containerId;
	this.update();
    };
    GcdView.prototype.getContainer = function getContainer(){
	if (!this.container) {
	    this.container = document.getElementById(this.containerId);
	}
	return this.container;
    };
    GcdView.prototype.update = function update(){
	var currentA = new NumberModel(this.model.a());
	var currentB = new NumberModel(this.model.b());

	this.clear();
	while (!this.same(currentA, currentB)){
	    this.append(currentA, currentB);
	    this.next(currentA, currentB);
	}
	this.append(currentA, currentB);
    };
    GcdView.prototype.clear = function clear(){
	this.getContainer().innerHTML = "";
    };
    GcdView.prototype.same = function same(a, b){
	return a.get() === b.get();
    };
    GcdView.prototype.append = function append(a, b){
	var container = this.getContainer();
	var tr = document.createElement("tr");
	var atd = document.createElement("td");
	atd.textContent = a.get();
	var btd = document.createElement("td");
	btd.textContent = b.get();
	tr.appendChild(atd);
	tr.appendChild(btd);
	container.appendChild(tr);
    };
    GcdView.prototype.next = function next(a, b){
	if (a.get() < b.get()) {
	    b.set(b.get() - a.get());
	} else {
	    a.set(a.get() - b.get());
	}
    };

    return euclid;
})();
