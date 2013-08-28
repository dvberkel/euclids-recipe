(function(euclid){
    var a = new euclid.NumberModel(37);
    var b = new euclid.NumberModel(51);

    new euclid.NumberView(a, "a");
    new euclid.NumberView(b, "b");
})(euclid);
