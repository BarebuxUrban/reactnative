import { Stack, useNavigation } from "expo-router";

const Layout = () => {
    return (
    <Stack>
        <Stack.Screen
        name="index"
        options={{
            headerShown: false
        }}
        />
        <Stack.Screen
        name="register"
        options={{
            headerShown: false
        }}/>
    </Stack>
  )
};

export default Layout;

