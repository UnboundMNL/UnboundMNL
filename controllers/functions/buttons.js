function dashboardButtons(authority) {
    let buttons;
    if (authority === "Admin") {
        buttons = [
            {
                text: "Clusters",
                href: "/cluster",
                icon: "bxs-folder-open"
            },
            {
                text: "Account Registration",
                href: "/registration",
                icon: "bxs-user-plus"
            },
            {
                text: "Manage Organization",
                href: "/masterlist",
                icon: "bx-building-house"
            },
            {
                text: "Total Savings & Matching Grant",
                href: "/savings",
                icon: "bx-money"
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
                text: "Account Registration",
                href: "/registration",
                icon: "bxs-user-plus"
            },
            {
                text: "Total Savings & Matching Grant",
                href: "/savings",
                icon: "bx-money"
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