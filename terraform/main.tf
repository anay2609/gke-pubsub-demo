resource "google_container_cluster" "gke" {

  name = "gke-demo"

  location = "asia-south1-a"

  remove_default_node_pool = true

  initial_node_count = 1

  deletion_protection = false

  node_config {

    machine_type = "e2-micro"

    disk_size_gb = 15

    disk_type = "pd-standard"

  }

}

resource "google_container_node_pool" "pool" {

  name = "demo-pool"

  cluster = google_container_cluster.gke.name

  location = "asia-south1-a"

  node_count = 1

  node_config {

    machine_type = "e2-micro"

    disk_size_gb = 15

    disk_type = "pd-standard"

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

  }

}
