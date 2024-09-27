import { useState, useEffect } from 'react';

import { Input, Form } from 'antd';
import { ENTER_EMAIL, VALID_EMAIL } from '../../configs/messages';


function HandleEmail({ onEmailChange }) {
    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValid(emailRegex.test(email));
        onEmailChange(email, isValid);
    }, [email, onEmailChange]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <Form.Item
            label="Email"
            name="email"
            rules={[
                {
                    required: true,
                    message: ENTER_EMAIL,
                },
                {
                    type: 'email',
                    message: VALID_EMAIL,
                },
            ]}
        >
            <Input
                value={email}
                onChange={handleEmailChange}
            />
        </Form.Item>
    )

}

export default HandleEmail;