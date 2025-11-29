window.CLOAK_TEST = true;
console.log("Tab cloak injected!");

// Observe the whole page for changes
const observer = new MutationObserver(() => {
    // Force the tab title
    document.title = "Home";

    // Force the favicon
    let link = document.querySelector("link[rel~='icon']");
    if (link) link.href = "/assets/icons/google-classroom.ico";
});

// Attach observer to document
observer.observe(document, { subtree: true, childList: true });
