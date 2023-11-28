query1 = "select id_product, name from product"
query2 = "select sum(quantity) from sales where id_product = "
query3 = "select price from product where id_product = "
query4 =  "select year(dates) as year, month(dates) as month, sum(total) as total from purchase group by year(dates), month(dates);"