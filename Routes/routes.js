import express from "express"
import User from "../model/Schema.js";
import bcrypt from "bcryptjs"
import authenticate from "../middlewares/authenticate.js";
// Company Schema
import Company from "../model/C_Schema.js";

const router = new express.Router();

router.post("/register", async (req, res) => {
    const { fname, email, password, cpassword } = req.body;

    if (!fname || !email || !password || !cpassword) {
        res.status(422).json({ error: "Fill all the details." })
    }

    try {
        const preuser = await User.findOne({ email: email });
        if (preuser) {
            res.status(422).json({ Error: "User already exists." })
        } else if (password !== cpassword) {
            res.status(422).json({ Error: "Password and cpassword didn't match." })
        } else {
            const finaluser = new User({
                fname, email, password, cpassword
            })
            // here password hasing done

            const storedata = await finaluser.save(err => {
                if (err) {
                    res.status(400).json(err)
                } else {
                    res.status(201).json({ message: "Registered Successfully.", finaluser })
                }
            })
        }


    } catch (error) {
        res.status(422).json({ error: "Catch error." })
    }
});

//Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422).json({ error: "Fill all the details." })
    }

    try {
        const userValid = await User.findOne({ email: email })

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);
            if (!isMatch) {
                res.status(422).json({ error: "Invailid user!!" })
            } else {
                // token generate
                const token = await userValid.generateAuthtoken();

                //cookie generate
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });

                const result = {
                    userValid,
                    token
                };

                res.status(201).json({ status: 201, result })
            }
        }

    } catch (error) {
        res.status(422).json({ error: "Catch error." })
    }
});

// valid user
router.get("/valid", authenticate, async (req, res) => {

    try {
        const validUser = await User.findOne({ _id: req.userId });
        res.status(201).json({ status: 201, validUser })

    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
})

// Logout

router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelm) => {
            return curelm.token !== req.token
        });

        res.clearCookie("userCookie", { path: "/" });

        req.rootUser.save();

        res.status(201).json(req.rootUser.tokens)
    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
});


// 2nd( Company_Collection)
router.post("/add", async (req, res) => {
    const { companyname, mobile, email, address, pincode, city, country, countrycode } = req.body;


    if (!companyname || !mobile || !email || !address || !pincode || !city || !country || !countrycode) {
        res.status(422).json({ error: "Fill all the details." })
    }

    const addUser = new Company;

    try {
        const newUser = new Company({
            companyname, mobile, email, address, pincode, city, country, countrycode
        })
        newUser.save((err) => {
            if (err) {
                res.status(400).json(err)
            } else {
                res.status(201).json(newUser)
            }
        })
    } catch (error) {
        res.status(401).json(error)
    }

});
// get Company list
router.get("/getCompany", async (req, res) => {
    try {
        const companies = await Company.find({});
        res.status(200).json(companies)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default router