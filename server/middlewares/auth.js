import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const token = req.headers.token || req.headers.authorization?.split(' ')[1];
    console.log('Auth: Token received:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('Auth: JWT Secret:', process.env.JWT_SECRET);

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET || "secret#text");
        console.log('Auth: Token verified successfully');

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        next();
    } catch (error) {
        console.log('Auth: JWT Error:', error.message);
        res.json({ success: false, message: error.message });
    }
}
 export default userAuth