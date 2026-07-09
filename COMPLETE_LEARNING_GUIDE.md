# ================================================================
# COMPLETE LEARNING GUIDE
# Java → Spring Boot → Hibernate/JPA → React
# For Sujith Kumar Reddy - Career Growth Edition
# ================================================================

# ================================================================
# CHAPTER 1: JAVA FUNDAMENTALS (Things interviews test heavily)
# ================================================================

## 1.1 OOP - 4 PILLARS (Every interview asks this)

### PILLAR 1: ENCAPSULATION
"Hiding internal data, exposing only what's needed"

    public class BankAccount {
        private double balance;  // private = hidden from outside

        public double getBalance() { return balance; }     // controlled access
        public void deposit(double amount) {
            if (amount > 0) balance += amount;             // validation before change
        }
    }

    // Someone CANNOT do: account.balance = -5000;  → compile error!
    // They MUST use: account.deposit(5000);         → safe!

WHY IT MATTERS: Protects data integrity. In Spring Boot, @Entity fields are
private and accessed via getters/setters (Lombok @Data generates them).

---

### PILLAR 2: INHERITANCE
"Child class gets all properties/methods of parent class"

    public class Animal {
        String name;
        public void eat() { System.out.println(name + " eats"); }
    }

    public class Dog extends Animal {
        public void bark() { System.out.println("Woof!"); }
    }

    Dog dog = new Dog();
    dog.eat();   // inherited from Animal ✓
    dog.bark();  // Dog's own method ✓

IN SPRING BOOT: RuntimeException → Exception → Throwable
Our TaskNotFoundException extends RuntimeException → inherits all exception behavior

---

### PILLAR 3: POLYMORPHISM
"Same method name, different behavior"

TYPE 1 - METHOD OVERLOADING (compile time):
    public int add(int a, int b) { return a + b; }
    public double add(double a, double b) { return a + b; }  // same name, diff params

TYPE 2 - METHOD OVERRIDING (runtime):
    public class Animal {
        public void sound() { System.out.println("..."); }
    }
    public class Cat extends Animal {
        @Override
        public void sound() { System.out.println("Meow"); }  // overrides parent
    }

    Animal a = new Cat();
    a.sound();  // prints "Meow" → runtime decides which method to call

IN SPRING BOOT: Interface → multiple implementations (polymorphism!)
    interface PaymentService { void pay(double amount); }
    class CreditCardPayment implements PaymentService { ... }
    class UpiPayment implements PaymentService { ... }

---

### PILLAR 4: ABSTRACTION
"Hide complexity, show only what's necessary"

ABSTRACT CLASS:
    abstract class Shape {
        abstract double area();  // no implementation, child MUST implement
        void display() { System.out.println("Area: " + area()); }
    }
    class Circle extends Shape {
        double radius;
        @Override
        double area() { return Math.PI * radius * radius; }
    }

INTERFACE:
    interface Printable {
        void print();    // no body (before Java 8)
    }

DIFFERENCE:
    Abstract class: can have state (fields), partial implementation
    Interface: only contracts (Java 8+ allows default methods)

IN SPRING BOOT: JpaRepository is an INTERFACE. Spring provides the implementation!
    You just write: interface TaskRepository extends JpaRepository<Task, Long> {}
    Spring Boot creates the implementation at runtime.

---

## 1.2 COLLECTIONS (Very important for interviews)

### List - ordered, allows duplicates
    List<String> names = new ArrayList<>();
    names.add("Sujith");
    names.add("Sujith");    // duplicate allowed
    names.get(0);           // access by index
    names.size();           // 2

    LinkedList vs ArrayList:
    ArrayList  → backed by array → fast READ (index), slow INSERT middle
    LinkedList → backed by linked nodes → fast INSERT, slow READ

### Set - no duplicates, no guaranteed order
    Set<String> skills = new HashSet<>();
    skills.add("Java");
    skills.add("Java");  // ignored! no duplicate
    // HashSet: O(1) add/contains (uses hashing)
    // TreeSet: sorted order, O(log n)

### Map - key-value pairs
    Map<String, Integer> scores = new HashMap<>();
    scores.put("Sujith", 95);
    scores.get("Sujith");     // 95
    scores.containsKey("x");  // false
    scores.entrySet()         // loop through all pairs

    INTERVIEW Q: How does HashMap work internally?
    → Uses array of "buckets" + linked list (or tree in Java 8+)
    → Key → hashCode() → bucket index → store there
    → If two keys same bucket (collision) → linked list in that bucket
    → get() → same hashCode → find bucket → compare with equals()

---

## 1.3 STREAM API (Modern Java - must know)

    List<Task> tasks = getAllTasks();

    // Filter + Map + Collect (most common pattern)
    List<String> completedTitles = tasks.stream()
        .filter(t -> t.getStatus() == TaskStatus.COMPLETED)  // keep only completed
        .map(t -> t.getTitle())                               // extract titles
        .collect(Collectors.toList());                        // collect to list

    // Count
    long highPriorityCount = tasks.stream()
        .filter(t -> t.getPriority() == TaskPriority.HIGH)
        .count();

    // Sort
    List<Task> sorted = tasks.stream()
        .sorted(Comparator.comparing(Task::getCreatedAt).reversed())
        .collect(Collectors.toList());

    // Find first match
    Optional<Task> firstHigh = tasks.stream()
        .filter(t -> t.getPriority() == TaskPriority.HIGH)
        .findFirst();

    // forEach
    tasks.stream().forEach(t -> System.out.println(t.getTitle()));

    USED IN MY PROJECT:
    return tasks.stream()
        .map(TaskResponseDTO::fromEntity)   // method reference
        .collect(Collectors.toList());

---

## 1.4 OPTIONAL (Avoid NullPointerException)

    // Without Optional - dangerous:
    Task task = taskRepository.findById(id);  // could be null!
    task.getTitle();  // NullPointerException if task is null!

    // With Optional - safe:
    Optional<Task> optional = taskRepository.findById(id);

    optional.isPresent()              // check if value exists
    optional.get()                    // get value (throws if empty)
    optional.orElse(defaultTask)      // return default if empty
    optional.orElseThrow(() -> new TaskNotFoundException(id))  // throw custom exception

    USED IN MY PROJECT:
    Task task = taskRepository.findById(id)
        .orElseThrow(() -> new TaskNotFoundException(id));

---

## 1.5 EXCEPTION HANDLING

    // Checked Exception: must handle with try-catch or throws
    public void readFile() throws IOException {
        FileReader fr = new FileReader("file.txt");  // might throw IOException
    }

    // Unchecked (RuntimeException): no forced handling
    int[] arr = new int[5];
    arr[10] = 1;  // ArrayIndexOutOfBoundsException at runtime

    // Custom exception (what I use):
    public class TaskNotFoundException extends RuntimeException {
        public TaskNotFoundException(Long id) {
            super("Task not found: " + id);
        }
    }

    // try-catch-finally:
    try {
        taskRepository.save(task);
    } catch (DataIntegrityViolationException e) {
        throw new RuntimeException("Duplicate entry", e);
    } finally {
        // always runs: close resources, cleanup
    }

    // try-with-resources (auto-closes):
    try (Connection conn = dataSource.getConnection()) {
        // conn.close() called automatically
    }

---

## 1.6 GENERICS

    // Without generics - unsafe:
    List list = new ArrayList();
    list.add("hello");
    list.add(123);
    String s = (String) list.get(1);  // ClassCastException at runtime!

    // With generics - compile-time safety:
    List<String> list = new ArrayList<>();
    list.add("hello");
    list.add(123);   // compile ERROR - caught early!
    String s = list.get(0);  // no cast needed

    // Generic method:
    public <T> ResponseEntity<T> ok(T body) {
        return new ResponseEntity<>(body, HttpStatus.OK);
    }

    USED EVERYWHERE: ResponseEntity<TaskResponseDTO>, List<Task>, Optional<Task>

---

## 1.7 INTERFACE vs ABSTRACT CLASS

    INTERFACE:
    - Only method signatures (Java 8+: default/static methods allowed)
    - No state (no instance fields)
    - A class can implement MULTIPLE interfaces
    - Use when: defining a CONTRACT (what to do, not how)

    ABSTRACT CLASS:
    - Can have fields, constructors, concrete methods
    - A class can extend only ONE abstract class
    - Use when: sharing common code between related classes

    WHEN TO USE WHICH?
    Interface = "can do" relationship: Runnable, Serializable, Printable
    Abstract  = "is a" relationship: Animal → Dog, Cat

    IN SPRING BOOT:
    - JpaRepository is an INTERFACE
    - Spring Boot generates the implementation automatically at startup

---

# ================================================================
# CHAPTER 2: SPRING BOOT DEEP DIVE
# ================================================================

## 2.1 SPRING BOOT AUTO-CONFIGURATION (Magic explained)

When you add spring-boot-starter-data-jpa to pom.xml:
Spring Boot sees it on the classpath and automatically:
  1. Creates a DataSource bean (from your application.properties)
  2. Creates EntityManagerFactory (Hibernate setup)
  3. Creates TransactionManager
  4. Enables JPA repositories

WITHOUT Spring Boot you'd write 50+ lines of XML/Java config.
WITH Spring Boot: just application.properties → done!

HOW? @EnableAutoConfiguration reads META-INF/spring.factories
     and loads hundreds of @Configuration classes conditionally.

---

## 2.2 SPRING BEAN LIFECYCLE

1. Spring scans for @Component, @Service, @Repository, @Controller
2. Creates instances (calls constructor)
3. Injects dependencies (@Autowired)
4. Calls @PostConstruct method (if any)
5. Bean is ready to use
6. On shutdown: calls @PreDestroy method (if any)

    @Service
    public class TaskService {
        @PostConstruct
        public void init() {
            System.out.println("TaskService initialized!");  // runs after creation
        }

        @PreDestroy
        public void cleanup() {
            System.out.println("TaskService shutting down");  // runs before destroy
        }
    }

---

## 2.3 @TRANSACTIONAL (Very important!)

A TRANSACTION = a group of DB operations that either ALL succeed or ALL fail.

EXAMPLE (banking):
    @Transactional
    public void transfer(Long fromId, Long toId, double amount) {
        Account from = accountRepo.findById(fromId).orElseThrow();
        Account to = accountRepo.findById(toId).orElseThrow();

        from.setBalance(from.getBalance() - amount);   // Step 1
        accountRepo.save(from);

        // If exception happens here... Step 2 never runs!
        // Without @Transactional: Step 1 committed, money LOST!
        // With @Transactional: Step 1 ROLLED BACK automatically!

        to.setBalance(to.getBalance() + amount);       // Step 2
        accountRepo.save(to);
    }

@Transactional tells Spring: "wrap all DB operations in one transaction"
If ANY exception thrown → ROLLBACK everything

PROPAGATION:
    REQUIRED     → join existing transaction, or create new one (DEFAULT)
    REQUIRES_NEW → always create new transaction
    SUPPORTS     → use transaction if exists, else no transaction

ISOLATION LEVELS (prevent concurrent access issues):
    READ_COMMITTED   → can't read uncommitted data (default in MySQL)
    REPEATABLE_READ  → same query returns same data in same transaction
    SERIALIZABLE     → highest isolation, lowest concurrency

---

## 2.4 SPRING MVC FLOW (Request Journey)

HTTP Request comes in
    ↓
DispatcherServlet (front controller - receives ALL requests)
    ↓
HandlerMapping (which @Controller handles this URL?)
    ↓
HandlerAdapter (calls the right method)
    ↓
Controller method runs
    ↓
View Resolver (for REST: skip - @ResponseBody writes JSON directly)
    ↓
HTTP Response sent back

---

## 2.5 SPRING SECURITY BASICS (for your career growth)

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                .csrf().disable()
                .authorizeHttpRequests()
                    .requestMatchers("/api/auth/**").permitAll()  // login/register: no auth
                    .anyRequest().authenticated()                 // everything else: need token
                .and()
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS); // JWT: no session
            return http.build();
        }
    }

JWT (JSON Web Token) flow:
    1. User logs in → POST /api/auth/login {username, password}
    2. Server validates → creates JWT token → returns token
    3. Client stores token (localStorage)
    4. Every request: header → Authorization: Bearer <token>
    5. Server validates token → extracts user → proceeds

---

## 2.6 DESIGN PATTERNS IN SPRING BOOT

SINGLETON: Every Spring bean is singleton by default
    One instance of TaskService for the whole app
    @Scope("prototype") → new instance per injection

FACTORY: BeanFactory / ApplicationContext
    Spring creates and manages objects → you don't use 'new'

PROXY: @Transactional works via AOP proxy
    Spring wraps your service in a proxy that adds transaction behavior
    You call taskService.save() → proxy intercepts → begins transaction → calls real method

TEMPLATE METHOD: JdbcTemplate, RestTemplate
    Template handles boilerplate (connection, cleanup)
    You only provide the SQL/URL

OBSERVER: ApplicationEvents
    @EventListener listens for events
    Good for loose coupling (send email when task created)

STRATEGY: Different implementations of same interface
    interface SortStrategy { List<Task> sort(List<Task> tasks); }
    class PrioritySort implements SortStrategy { ... }
    class DateSort implements SortStrategy { ... }

---

# ================================================================
# CHAPTER 3: HIBERNATE & JPA COMPLETE GUIDE
# ================================================================

## 3.1 WHAT IS ORM?

WITHOUT ORM (JDBC - manual):
    String sql = "INSERT INTO tasks(title, status) VALUES(?, ?)";
    PreparedStatement ps = connection.prepareStatement(sql);
    ps.setString(1, task.getTitle());
    ps.setString(2, task.getStatus().name());
    ps.executeUpdate();
    // Close connection, handle exceptions... 20+ lines per operation!

WITH ORM (JPA/Hibernate):
    taskRepository.save(task);  // ONE LINE! Hibernate generates SQL automatically

ORM = maps Java class → DB table
      maps Java field → DB column
      maps Java object → DB row

---

## 3.2 ENTITY MAPPINGS EXPLAINED

    @Entity                         // This class = a table
    @Table(name = "tasks")          // Table name in MySQL
    public class Task {

        @Id                         // PRIMARY KEY
        @GeneratedValue(strategy = GenerationType.IDENTITY)  // AUTO_INCREMENT
        private Long id;

        @Column(
            name = "title",         // column name (default: field name)
            nullable = false,       // NOT NULL in SQL
            length = 100,           // VARCHAR(100)
            unique = false          // no UNIQUE constraint
        )
        private String title;

        @Enumerated(EnumType.STRING)  // Store "TODO" not 0
        private TaskStatus status;    // Without this: stores 0, 1, 2 (confusing!)

        @CreatedDate / @UpdatedDate   // Spring Data auto-manages
        private LocalDateTime createdAt;

        @Transient                    // NOT stored in DB
        private String temporaryData; // calculated field
    }

---

## 3.3 JPA RELATIONSHIPS

ONE-TO-MANY: One User has Many Tasks

    @Entity
    public class User {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String name;

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private List<Task> tasks = new ArrayList<>();
        //         ↑ tells Hibernate: "user" field in Task owns this relationship
    }

    @Entity
    public class Task {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id")  // foreign key column in tasks table
        private User user;
    }

MANY-TO-MANY: Many Tasks have Many Tags

    @Entity
    public class Task {
        @ManyToMany
        @JoinTable(
            name = "task_tags",          // join table name
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
        )
        private List<Tag> tags = new ArrayList<>();
    }

---

## 3.4 FETCH TYPES (N+1 Problem - very important!)

FetchType.LAZY  → Load related data ONLY when accessed (default for @OneToMany)
FetchType.EAGER → Load related data IMMEDIATELY with parent (default for @ManyToOne)

N+1 PROBLEM:
    // You want 10 users with their tasks:
    List<User> users = userRepo.findAll();         // Query 1: SELECT * FROM users (10 rows)
    for (User u : users) {
        System.out.println(u.getTasks().size());   // Query 2,3,4...11: SELECT * FROM tasks WHERE user_id=?
    }
    // Total: 1 + 10 = 11 queries! (N+1 problem)

SOLUTION - use JOIN FETCH:
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.tasks")
    List<User> findAllWithTasks();
    // Now: 1 query with JOIN → much faster!

---

## 3.5 CASCADE TYPES

    @OneToMany(cascade = CascadeType.ALL)

CASCADE = "when I do X to parent, do X to children too"

    CascadeType.PERSIST  → save parent → also saves children
    CascadeType.MERGE    → update parent → also updates children
    CascadeType.REMOVE   → delete parent → also deletes children
    CascadeType.ALL      → all of the above

    // Example: delete user → automatically deletes all their tasks
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;
    // orphanRemoval: if you remove a task from the list, it's deleted from DB

---

## 3.6 JPQL vs SQL

SQL uses TABLE names and COLUMN names:
    SELECT * FROM tasks WHERE status = 'TODO'

JPQL uses CLASS names and FIELD names:
    SELECT t FROM Task t WHERE t.status = 'TODO'
    //           ↑ class name    ↑ field name

    @Query("SELECT t FROM Task t WHERE t.status = :status")
    List<Task> findByStatus(@Param("status") TaskStatus status);

NATIVE QUERY (when JPQL isn't enough):
    @Query(value = "SELECT * FROM tasks WHERE title LIKE %:keyword%", nativeQuery = true)
    List<Task> searchByTitle(@Param("keyword") String keyword);

---

## 3.7 SPRING DATA JPA DERIVED QUERIES (Magic!)

Spring reads the method NAME and generates SQL:

    findByTitle(String title)
    → SELECT * FROM tasks WHERE title = ?

    findByTitleAndStatus(String title, TaskStatus status)
    → SELECT * FROM tasks WHERE title = ? AND status = ?

    findByTitleContaining(String keyword)
    → SELECT * FROM tasks WHERE title LIKE %?%

    findByStatusOrderByCreatedAtDesc(TaskStatus status)
    → SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC

    findByPriorityIn(List<TaskPriority> priorities)
    → SELECT * FROM tasks WHERE priority IN (?, ?, ?)

    findByCreatedAtBetween(LocalDateTime start, LocalDateTime end)
    → SELECT * FROM tasks WHERE created_at BETWEEN ? AND ?

    countByStatus(TaskStatus status)
    → SELECT COUNT(*) FROM tasks WHERE status = ?

    existsByTitle(String title)
    → SELECT COUNT(*) > 0 FROM tasks WHERE title = ?

---

## 3.8 HIBERNATE FIRST LEVEL CACHE

Within the SAME session/transaction, Hibernate caches entities:

    Task task1 = repo.findById(1L).get();  // DB query executed
    Task task2 = repo.findById(1L).get();  // NO DB query! returns cached

    task1 == task2  // true - same object from cache

This is L1 cache. Automatic, always on.
L2 cache: across sessions (EhCache, Redis) - optional, configured separately.

---

# ================================================================
# CHAPTER 4: REACT COMPLETE GUIDE
# ================================================================

## 4.1 WHY REACT? THE CORE IDEA

Traditional websites: Server sends complete HTML every time
    User clicks → Server generates HTML → Sends full page → Browser reloads

React (SPA - Single Page Application):
    Page loads ONCE → React updates only what changed → No full reload

VIRTUAL DOM:
    React keeps a Virtual DOM (JavaScript copy of real DOM)
    When state changes:
    1. React creates new Virtual DOM
    2. Compares with previous Virtual DOM (diffing/reconciliation)
    3. Calculates MINIMUM changes needed
    4. Updates only those parts in real DOM
    → Much faster than replacing entire page!

---

## 4.2 COMPONENTS - Building Blocks

    // Functional component (modern React - always use this)
    function TaskCard({ task, onDelete }) {  // props destructured
        return (
            <div className="card">
                <h3>{task.title}</h3>
                <button onClick={() => onDelete(task.id)}>Delete</button>
            </div>
        );
    }

    // Usage:
    <TaskCard task={myTask} onDelete={handleDelete} />

JSX Rules:
    - Must return ONE parent element (or <> fragment </>)
    - className instead of class (class is JS keyword)
    - onClick not onclick (camelCase)
    - {expression} for JavaScript inside JSX
    - Self-closing: <img /> not <img>

---

## 4.3 STATE vs PROPS

PROPS (properties):
    - Passed FROM parent TO child
    - READ ONLY inside child (cannot modify)
    - Like function arguments

STATE:
    - Owned by the component itself
    - When state changes → component re-renders
    - Like a component's memory

    function Counter() {
        const [count, setCount] = useState(0);  // state

        return (
            <div>
                <p>Count: {count}</p>
                <button onClick={() => setCount(count + 1)}>+</button>
            </div>
        );
    }

    // Parent:
    <Counter />       // Counter owns its own state

    // If counter needs to be controlled by parent:
    <Counter count={parentCount} onIncrement={handleIncrement} />
    // Now count is a PROP (controlled by parent)

---

## 4.4 ALL REACT HOOKS EXPLAINED

### useState
    const [value, setValue] = useState(initialValue);
    
    setValue(newValue)          // replace
    setValue(prev => prev + 1)  // functional update (when new value depends on old)

### useEffect
    // On mount + on every render:
    useEffect(() => { doSomething(); });

    // On mount ONCE:
    useEffect(() => { fetchData(); }, []);

    // When dependency changes:
    useEffect(() => { fetchTasks(); }, [filter]);

    // Cleanup (runs before next effect or unmount):
    useEffect(() => {
        const timer = setInterval(() => {}, 1000);
        return () => clearInterval(timer);  // cleanup!
    }, []);

### useContext
    const { tasks, addTask } = useContext(TaskContext);

### useRef
    const inputRef = useRef(null);
    <input ref={inputRef} />
    inputRef.current.focus();  // focus the input programmatically

    // Also: store value without re-render (unlike useState)
    const renderCount = useRef(0);
    renderCount.current++;  // doesn't trigger re-render

### useCallback
    // Memoizes a function - same function reference until dependencies change
    const fetchTasks = useCallback(async () => {
        const data = await api.getTasks();
        setTasks(data);
    }, [filter]);  // only recreates when filter changes

    WHY: Without useCallback, every render creates a NEW function
         New function → useEffect sees it as a change → infinite loop!

### useMemo
    // Memoizes a computed value
    const expensiveResult = useMemo(() => {
        return tasks.filter(t => complexLogic(t));
    }, [tasks]);  // only recalculates when tasks changes

    useCallback = memoize a FUNCTION
    useMemo     = memoize a VALUE

### useReducer (for complex state)
    // Like Redux in a component
    function reducer(state, action) {
        switch (action.type) {
            case 'ADD_TASK':
                return { ...state, tasks: [...state.tasks, action.payload] };
            case 'DELETE_TASK':
                return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
            default: return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, { tasks: [] });

    dispatch({ type: 'ADD_TASK', payload: newTask });

---

## 4.5 COMPONENT LIFECYCLE

Functional components with hooks:

    MOUNT (component appears):
        → Component function runs
        → JSX renders
        → DOM updates
        → useEffect with [] runs

    UPDATE (state/props change):
        → Component function runs again
        → React diffs virtual DOM
        → DOM updates minimally
        → useEffect with [dep] runs if dep changed

    UNMOUNT (component removed):
        → Cleanup function in useEffect runs

---

## 4.6 LIST RENDERING & KEYS

    {tasks.map(task => (
        <TaskCard
            key={task.id}    // MUST provide unique key!
            task={task}
            onDelete={handleDelete}
        />
    ))}

    WHY key is important:
    Without key: React can't tell which item changed → re-renders all
    With key: React knows exactly which item changed → only re-renders that one

    NEVER use array index as key if list can reorder/delete!
    // BAD: key={index}  → when you delete item 2, item 3 becomes key=2, confuses React
    // GOOD: key={task.id} → stable, unique

---

## 4.7 CONDITIONAL RENDERING

    // Ternary
    {loading ? <Spinner /> : <TaskList />}

    // Short circuit (show only if true)
    {error && <ErrorMessage message={error} />}

    // Null = render nothing
    {isAdmin && <AdminPanel />}

    // If-else style
    const renderContent = () => {
        if (loading) return <Spinner />;
        if (error) return <Error />;
        if (tasks.length === 0) return <EmptyState />;
        return <TaskList tasks={tasks} />;
    };

    return <div>{renderContent()}</div>;

---

## 4.8 AXIOS INTERCEPTORS (Advanced - impressive in interviews)

    // Request interceptor - runs before every request
    axios.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Response interceptor - runs after every response
    axios.interceptors.response.use(
        response => response,  // success: pass through
        error => {
            if (error.response.status === 401) {
                // Token expired → logout user
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

---

## 4.9 ASYNC/AWAIT vs PROMISES

    // Promise (old way):
    fetchTasks()
        .then(data => setTasks(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));

    // Async/Await (modern, cleaner):
    const fetchTasks = async () => {
        try {
            const data = await taskService.getAllTasks();
            setTasks(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Parallel requests (faster - don't await one by one):
    const [tasks, users] = await Promise.all([
        taskService.getAllTasks(),
        userService.getAllUsers()
    ]);

---

# ================================================================
# CHAPTER 5: INTERVIEW MASTER ANSWERS
# ================================================================

## "What happens when you type http://localhost:8080/api/tasks in Postman?"

1. Request reaches Spring Boot's embedded Tomcat
2. DispatcherServlet receives all requests
3. HandlerMapping finds: TaskController has @GetMapping("/api/tasks")
4. Spring checks for @Valid, @RequestParam, @PathVariable - extracts values
5. TaskController.getAllTasks() is called
6. TaskService.getAllTasks() called
7. TaskRepository.findAllByOrderByCreatedAtDesc() called
8. Hibernate generates: SELECT * FROM tasks ORDER BY created_at DESC
9. MySQL returns ResultSet
10. Hibernate maps each row → Task object
11. Service converts Task → TaskResponseDTO
12. Controller wraps in ResponseEntity with 200 OK
13. Spring's Jackson library converts List<TaskResponseDTO> → JSON
14. JSON sent back in HTTP response body

---

## "What is @Autowired and Dependency Injection?"

Spring IoC Container creates and manages all beans.
@Autowired tells Spring: "inject this dependency here"

3 types:
1. Constructor injection (BEST - fields can be final):
   public TaskService(TaskRepository repo) { this.repo = repo; }

2. Setter injection:
   @Autowired
   public void setRepo(TaskRepository repo) { this.repo = repo; }

3. Field injection (AVOID in production code):
   @Autowired
   private TaskRepository repo;

WHY CONSTRUCTOR INJECTION IS BEST:
- Fields can be final (immutable - thread safe)
- Immediately visible in constructor what dependencies are needed
- Easy to test (just pass mock in constructor)

---

## "Difference between @Component, @Service, @Repository, @Controller"

All are @Component with different names:
@Component    → Generic bean
@Service      → Business logic layer (semantic meaning, no extra behavior)
@Repository   → Data layer + translates DB exceptions to Spring's DataAccessException
@Controller   → Web layer - returns views (HTML)
@RestController → Web layer - returns JSON (@Controller + @ResponseBody)

---

## "What is the difference between HashMap and Hashtable?"

HashMap:
  - Not synchronized (not thread-safe)
  - Allows one null key
  - Faster (no synchronization overhead)
  - Use when: single-threaded or you handle thread safety

Hashtable:
  - Synchronized (thread-safe)
  - No null keys
  - Slower
  - Legacy class (avoid in modern code)

For thread-safe map: use ConcurrentHashMap (better than Hashtable)

---

## "What is the difference between String, StringBuilder, StringBuffer?"

String: IMMUTABLE
    String s = "Hello";
    s = s + " World";  // creates NEW string "Hello World", old one in heap
    → 1000 concatenations = 1000 objects! (Memory waste)

StringBuilder: MUTABLE, NOT thread-safe
    StringBuilder sb = new StringBuilder("Hello");
    sb.append(" World");  // modifies same object
    → Use in single-threaded code (loops, building strings)

StringBuffer: MUTABLE, thread-safe (synchronized)
    → Use in multi-threaded code (slower due to synchronization)

---

## "What is Spring Boot Actuator?"

Actuator adds production-ready monitoring endpoints:
    /actuator/health   → is app up? { "status": "UP" }
    /actuator/metrics  → memory, CPU, request count
    /actuator/info     → app info
    /actuator/env      → all environment variables
    /actuator/beans    → all Spring beans

Add dependency: spring-boot-starter-actuator
Used in microservices for health checks (load balancer checks /health)

---

## "React vs Angular vs Vue - when to use what?"

React:
  - Library (not full framework) - choose your own routing, state management
  - Large ecosystem, flexible
  - Used by Facebook, Instagram, Netflix
  - Steeper learning curve initially, more flexible

Angular:
  - Full framework (everything included)
  - TypeScript-first
  - More opinionated (one way to do things)
  - Used by Google, enterprise apps

Vue:
  - Progressive framework (use as much or little as you want)
  - Easier learning curve
  - Good documentation
  - Popular in Asia/China

For interviews: "I chose React because of its component-based architecture,
large ecosystem, and wide industry adoption."

---

# ================================================================
# CHAPTER 6: WHAT TO LEARN NEXT (Career Path)
# ================================================================

## LEVEL 1: Strengthen fundamentals (2-4 weeks)
- Practice 50 Java coding problems on LeetCode (Easy level)
- Build the Task Manager project from scratch yourself
- Add user authentication to it (Spring Security + JWT)

## LEVEL 2: Database & Design (4-6 weeks)
- MySQL joins: INNER, LEFT, RIGHT, FULL OUTER
- Indexes: what they are, when to use
- Stored procedures and transactions
- Database design: normalization (1NF, 2NF, 3NF)
- Flyway for DB migrations

## LEVEL 3: Advanced Spring Boot (4-6 weeks)
- Spring Security + JWT (project: add login to task manager)
- REST API best practices (versioning, pagination)
- Spring Boot Testing: @SpringBootTest, MockMvc, Mockito
- Exception handling patterns
- Caching with Redis (@Cacheable)

## LEVEL 4: Advanced React (4-6 weeks)
- React Router (multiple pages)
- State management: Redux Toolkit
- TypeScript with React
- Testing: Jest + React Testing Library

## LEVEL 5: DevOps & Cloud (ongoing)
- Docker (you have this - deepen it)
- Kubernetes basics
- AWS certification (Solutions Architect Associate)
- CI/CD with GitHub Actions (simpler than Jenkins)

## CODING PRACTICE SITES:
- LeetCode: Data structures, algorithms
- HackerRank: Java-specific practice
- CodeChef: Competitive programming
- Spring.io guides: Official Spring Boot tutorials

## KEY TOPICS FOR INTERVIEWS:
1. SOLID principles (Single Responsibility, Open/Closed, etc.)
2. Design patterns (Singleton, Factory, Builder, Observer)
3. Microservices basics
4. REST API design principles
5. SQL query optimization

---

# ================================================================
# QUICK REFERENCE CARD (Print this!)
# ================================================================

## Annotations Cheat Sheet
    @SpringBootApplication  → main class
    @RestController         → REST API class
    @Service                → business logic
    @Repository             → data access
    @Entity                 → JPA entity
    @Table(name="")         → table name
    @Id                     → primary key
    @GeneratedValue         → auto increment
    @Column                 → column config
    @GetMapping             → HTTP GET
    @PostMapping            → HTTP POST
    @PutMapping             → HTTP PUT
    @DeleteMapping          → HTTP DELETE
    @RequestBody            → read JSON body
    @PathVariable           → read URL part /tasks/{id}
    @RequestParam           → read query param ?status=TODO
    @Valid                  → trigger validation
    @Transactional          → wrap in DB transaction
    @Autowired              → inject dependency
    @CrossOrigin            → allow CORS

## HTTP Status Codes
    200 OK               → success
    201 Created          → POST success
    204 No Content       → DELETE success
    400 Bad Request      → invalid input
    401 Unauthorized     → not logged in
    403 Forbidden        → logged in but no permission
    404 Not Found        → resource doesn't exist
    500 Internal Error   → bug in code

## React Hooks Quick Ref
    useState(init)       → state + setter
    useEffect(fn, [])    → run after mount
    useEffect(fn, [dep]) → run when dep changes
    useContext(ctx)      → consume context
    useRef(null)         → DOM ref / mutable value
    useCallback(fn, [])  → memoize function
    useMemo(fn, [])      → memoize value
    useReducer(r, init)  → complex state
