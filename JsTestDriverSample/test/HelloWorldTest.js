TestCase("HelloTest", {
    "test hello": function() {
        var hello = new myapp.HelloWorld();
        assertEquals("Hello World!", hello.sayHello("World"));
    },
    "test hello null": function() {
        var hello = new myapp.HelloWorld();
        assertNull(greeter.hello(null));
    }
});