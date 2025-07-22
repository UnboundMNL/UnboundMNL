// Dashboard button
function dashboardButtons(authority) {
    let buttons;
    if (authority === "Admin") {
        buttons = [
            {
                text: "Clusters",
                href: "/cluster",
                icon: "bx-category",
                color: "red"
            },
            {
                text: "Members Masterlist",
                href: "/masterlist",
                icon: "bxs-user-account",
                color: "brown"
            },
            {
                text: "Account Management",
                href: "/accounts",
                icon: "bx-cog",
                color: "green"
            },
            {
                text: "Account Registration",
                href: "/registration",
                icon: "bxs-user-plus",
                color: "blue"
            }
        ];
    } else if (authority === "SEDO") {
        buttons = [
            {
                text: "Projects",
                href: "/project",
                icon: "bxs-folder-open"
            },
            {
                text: "Manage Cluster",
                href: "/masterlist",
                icon: "bx-grid-alt"
            },
            {
                text: "Account Management",
                href: "/accounts",
                icon: "bx-cog"
            },
            {
                text: "Account Registration",
                href: "/registration",
                icon: "bxs-user-plus"
            }
        ];
    } else if (authority === "Treasurer") {
        buttons = [
            {
                text: "Members",
                href: "/member",
                icon: "bx-group"
            }
        ];
    }
    return buttons;
}

module.exports = { dashboardButtons };
