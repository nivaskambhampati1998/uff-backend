//productmodel file to be imported here

exports.dummyMiddleware = (req,res,next) =>{
	console.log("dummy middleware executed");
	next();
};

exports.dummyFunction = async(req,res) =>{
	console.log("dummy function executed from the product controller");
	res.send("DONE");
};