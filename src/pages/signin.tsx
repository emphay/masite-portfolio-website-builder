import React from "react";
import { useRouter } from "next/router";
import { Button, Form, Input } from 'antd';
import styles from '../styles/signin.module.css'; 
import { signIn } from "next-auth/react";

export default function SignIn() {
    const router = useRouter();

    const handleSignIn = async (values: { username: string; password: string }) => {
        await signIn('credentials', {
            redirect: true,
            callbackUrl: '/',
            ...values
        });
    };

    return (
        <Form
            name="signin"
            initialValues={{ remember: true }}
            onFinish={handleSignIn}
            className={styles.signinForm} 
        >
            <h1>Login to Masite</h1>
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
                className={styles.signinFormItem} 
            >
                <Input placeholder="Username" />
            </Form.Item>
            
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
                className={styles.signinFormItem} 
            >
                <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.customButton}>
                    Sign In
                </Button>
            </Form.Item>
        </Form>
    );
}
