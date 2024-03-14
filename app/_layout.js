const { Stack } = require("expo-router");

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
};

export default RootLayout;