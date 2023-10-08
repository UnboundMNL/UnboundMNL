function dashboardButtons(authority){
    let buttons ;
    if (authority === "Admin"){
        buttons = [
            {
                text: "Clusters",
                href: "/clusterLoad",
                icon: "bxs-folder-open"
            },
            {
                text: "Account Registration",
                href: "/registrationLoad",
                icon: "bxs-user-plus"
            },
            {
                text: "Manage Organization",
                href: "#",
                icon: "bx-building-house"
            },
            {
                text: "Total Savings & Matching Grant",
                href: "/savingsLoad",
                icon: "bxs-bank"
            }
        ]
    } else if (authority === "SEDO"){
        buttons = [
            {
                text: "Projects",
                href: "/projectLoad",
                icon: "bxs-folder-open"
            },
            {
                text: "Manage Cluster",
                href: "#",
                icon: "bx-grid-alt"
            },
            {
                text: "Account Registration",
                href: "/registrationLoad",
                icon: "bxs-user-plus"
            },
            {
                text: "Total Savings & Matching Grant",
                href: "/savingsLoad",
                icon: "bxs-bank"
            }
        ]
    } else if (authority === "Treasurer"){
        buttons = [
            {
                text: "Members",
                href: "/groupLoad",
                icon: "bx-group"
            },
            {
                text: "Manage Group",
                href: "#",
                icon: "bx-building-house"
            },
            {
                text: "Total Savings & Matching Grant",
                href: "/savingsLoad",
                icon: "bxs-bank"
            }
        ]
    }
    return buttons;
}
module.exports = {dashboardButtons};