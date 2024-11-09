import React from "react";
import { Form, Input, Button, message } from 'antd';
import styles from '../styles/signup.module.css';
import { useRouter } from "next/router";

export default function SignUp() {

    const router = useRouter();
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                message.success("Account has been created Successfully");
                router.push('/signin');
            })
            .catch((error) => {
                console.error('Error:', error);
                message.error("Error in creating your account");
            });
    };

    return (
        <Form
            name="signup"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className={styles.signupForm}
        >
            <h1 className={styles.formTitle}>Sign Up to Masite</h1>
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                ]}
            >
                <Input type="email" placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.submitButton}>
                    Sign up
                </Button>
            </Form.Item>
        </Form>
    );
}
