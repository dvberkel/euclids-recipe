var euclid = (function(){
    var euclid = {};

    euclid.NumberModel = function NumberModel(n){
	this.set = function set(number){
	    n = number || 1;
	}
	this.get = function get(){
	    return n;
	}
    };

    var NumberView = euclid.NumberView = function NumberView(model, containerId) {
	this.model = model;
	this.containerId = containerId;
	this.update();
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

    return euclid;
})();
