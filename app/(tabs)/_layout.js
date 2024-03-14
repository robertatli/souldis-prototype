import { Tabs } from "expo-router";

const TabsLayout = () => {
    return (
    <Tabs>
        <Tabs.Screen name="App" />
        <Tabs.Screen name="QuestionairePage" />
    </Tabs>
    );
};

export default TabsLayout;