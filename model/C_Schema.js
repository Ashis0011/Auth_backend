import mongoose from "mongoose";

const companySchema = ({
    companyname: String,
    mobile: String,
    email: String,
    address: String,
    pincode: String,
    city: String,
    country: String,
    countrycode:String
});

const Company = mongoose.model("C_list", companySchema);

export default Company
