function dashboardButtons(authority) {
    let buttons;
    if (authority === "Admin") {
        buttons = [
            {
                text: "Clusters",
                href: "/cluster",
                icon: "bx-category"
            },
            {
                text: "Members Masterlist",
                href: "/masterlist",
                icon: "bxs-user-account"
            },
            {
                text: "Account Management",
                href: "/savings",
                icon: "bx-cog"
            },
            {
                text: "Account Registration",
                href: "/registration",
                icon: "bxs-user-plus"
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
                href: "/member",
                icon: "bx-grid-alt"
            },
            {
                text: "Account Management",
                href: "/savings",
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
            },
            {
                text: "Total Savings & Matching Grant",
                href: "/savings",
                icon: "bx-money"
            }
        ];
    }
    return buttons;
}

module.exports = { dashboardButtons };