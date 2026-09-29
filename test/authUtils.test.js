const {
    validateCredentials,
    logAuthEvent, 
    registerUser,
    createSessionId,
} = require("../authUtils");

const {
    createUser,
    isAdmin
} = require( '../routes/roles');

// G1 (S)
describe("G1: Two sesion IDS for the same user are different.", () => {
    test("createSessionId returns a different value each time", () => {
        const id1 = createSessionId();
        const id2 = createSessionId();
        expect(id1).not.toBe(id2);
    });
});

// G2: sessionID is not a hash of the username (S)
describe("G2: Session ID format.", () => {
    test("is 64 hex charachters long.", () => {

        const id = createSessionId();
        expect(id).toMatch(/^[0-9a-f]{64}$/);
    });
});

// G3: Empty username is rejected (T)
describe("G3: Empty username.", () =>{
    test("Emty string returns false", () =>{
        const username = "";
        const password = "Secret123";

        const result = validateCredentials(username, password);
        expect(result).toBe(false);
    });
});

test("Spaces only as string returns fals.", () =>{
    const result = validateCredentials("   ", "Secret123");
    expect(result).toBe(false);
});

//G4: missing or null password is rejected.
describe("G4: missing or null password", () => {
    test("null password returns false.", ()=> {
        const result = validateCredentials("mahdi", "123456");
        expect(result).toBe(false);
    });

    test("8 characters return true", () => {
        const result = validateCredentials("mahdi", "12345678");
        expect(result).toBe(true);
    });
});

// G5: Password length boundry
describe("G5: Password length boundry.", ()=> {
    test("7 characters returns false", () =>{
        const result = validateCredentials("mahdi", "1234567");
        expect(result).toBe(false);
    });

    test("8 charaters return true", () => {
        const result = validateCredentials("mahdi", "12345678");
        expect(result).toBe(true);
    });
});

//G6 Test (T)
describe("G6: Wrong data types", () => {
    test("number as username returns false", () => {
        const username = 12345;
        const result = validateCredentials(username, "Secret123");
        expect(result).toBe(false);
    });

    test("object as username returns false", () => {
        const result = validateCredentials({ name: "jere" }, "Secret123");
        expect(result).toBe(false);
    });

    test("number as password returns false", () => {
        const result = validateCredentials("jere", 12345678);
        expect(result).toBe(false);
    });
});

// G7 Test (R)
describe("G7: failed login is logged", () => {
    test("logger is called with the event type and username", () => {
        const fakeLogger = jest.fn();
        logAuthEvent("login_failed", { username: "jere" }, fakeLogger);
        expect(fakeLogger).toHaveBeenCalledTimes(1);
        const logged = fakeLogger.mock.calls[0][0];
        expect(logged).toContain("login_failed");
        expect(logged).toContain("john");
    });
});

//G8 Test (I)
describe("G8: no secrets in logs", () => {
    test("password and sessionId are not in the log line", () => {
        const fakeLogger = jest.fn();
        const details = { username: "jere", password: "Secret123", sessionId: "abc123" };
        logAuthEvent("login_failed", details, fakeLogger);
        const logged = fakeLogger.mock.calls[0][0];
        expect(logged).not.toContain("Secret123");
        expect(logged).not.toContain("abc123");
        expect(logged).toContain("jere");
    });
});

//G9 Test (D)
describe("G9: registration without password", () => {
    test("returns an error result and does not throw", () => {
        const input = { username: "jere" };
        expect(() => registerUser(input)).not.toThrow();
        const result = registerUser(input);
        expect(result.ok).toBe(false);
    });

    test("missing input (undefined) does not crash", () => {
        expect(registerUser(undefined).ok).toBe(false);
    });
});

//G10a Test (E)
describe("G10a extra role field at registration", () => {
    test("createUser ingnores role: admin from the client", () => {
        const evilInput = { username: "jere", password: "Secret123", role: "admin" };
        const user = createUser(evilInput);
        expect(user.role).toBe("user");
    });

    test("registerUser also creates a normal user", () => {
        const evilInput = { username: "jere", password: "Secret123", role: "admin" };
        const result = registerUser(evilInput);
        expect(result.ok).toBe(true);
        expect(result.user.role).toBe("user");
    });
});

// G10b-d Test (E)
describe("G11b-d: isAdmin", () => {
    test("G11b: a normal user is not an admin", () => {
        expect(isAdmin({ username: "jere", role: "user" })).toBe(false);
    });

    test("G10c: a real admin passes", () => {
        expect(isAdmin({ username: "Saara", role: "admin" })).toBe(true);
    });

    test("G10d: unknown role has no rights", () => {
        expect(isAdmin({ username: "Matti", role: "superuser" })).toBe(false);
    });

    test("G10d: missing role has no rights", () => {
        expect(isAdmin({ username: "Tiia" })).toBe(false);
    });

    test("G10d: null and undefined do not crash", () => {
        expect(isAdmin(null)).toBe(false);
        expect(isAdmin(undefined)).toBe(false);
    });
});