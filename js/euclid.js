var euclid = (function(undefined){
    var euclid = {};

    var Observable = {
	observers : function observers(){
	    if (!this._observers) {
		this._observers = [];
	    }
	    return this._observers;
	},
	addObserver : function addObserver(observer){
	    this.observers().push(observer);
	},
	notify : function notify(){
	    var observers = this.observers();
	    for (var index = 0; index < observers.length; index++){
		var observer = observers[index];
		observer.call(null, this);
	    }
	}
    }

    var extend = function(target, extension){
	for (key in extension) {
	    if (extension.hasOwnProperty(key)) {
		target[key] = extension[key];
	    }
	}
    };

    var NumberModel = euclid.NumberModel = function NumberModel(n){
	this.set = function set(number){
	    n = Math.max(number || 1, 1);
	    this.notify();
	}
	this.get = function get(){
	    return n;
	}
    };
    extend(NumberModel.prototype, Observable);

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
	var self = this;
	var notify = function notify(u){ self.notify(); }
	self.aModel = aModel;
	self.bModel = bModel;
	self.aModel.addObserver(notify);
	self.bModel.addObserver(notify);
    };
    extend(GcdModel.prototype, Observable);
    GcdModel.prototype.a = function a(){
	return this.aModel.get();
    };
    GcdModel.prototype.b = function b(){
	return this.bModel.get();
    };

    var GcdView = euclid.GcdView = function GcdView(model, containerId){
	var self = this;
	self.model = model;
	self.containerId = containerId;
	self.update();
	self.model.addObserver(function(){ self.update(); });
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

    var NumberController = euclid.NumberController = function NumberController(model, containerId){
	this.model = model;
	this.containerId = containerId;
	this.registerControls();
    };
    NumberController.prototype.getContainer = function getContainer(){
	if (!this.container) {
	    this.container = document.getElementById(this.containerId);
	}
	return this.container;
    };
    NumberController.prototype.getBody = function getBody(){
	if (!this.body) {
	    this.body = document.getElementsByTagName("body")[0];
	}
	return this.body;
    }
    NumberController.prototype.registerControls = function RegisterControls(){
	var self = this;
	var container = this.getContainer();
	var body = this.getBody();
	controls(self, container, body);
    };
    NumberController.prototype.increase = function increase(by){
	by = by || 1;
	this.model.set(this.model.get() + by);
    };

    function controls(self, container, body){
	var startY = undefined; var currentY = undefined
	var move = function move(event){
	    currentY = event.screenY;
	    container.textContent = self.model.get() - (currentY - startY);
	};
	container.addEventListener("mousedown", function(event){
	    startY = event.screenY; currentY = event.screenY;
	    body.addEventListener("mousemove", move);
	});
	body.addEventListener("mouseup", function(event){
	    body.removeEventListener("mousemove", move);
	    if (startY && currentY) {
		self.increase(-(currentY - startY));
	    }
	    startY = undefined; currentY = undefined;
	});
    };

    return euclid;
})();
