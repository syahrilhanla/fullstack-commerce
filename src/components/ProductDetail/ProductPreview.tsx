"use client";

import { Product } from "@/types/Product.type";
import { Image } from "@heroui/react";
import { useState } from "react";

interface Props {
	product: Product;
}

const ProductPreview = ({ product }: Props) => {
	const [selectedImage, setSelectedImage] = useState(product?.images[0]);

	const handleImageClick = (index: number) => {
		// Handle image click event here
		setSelectedImage(product?.images[index]);
	};

	return (
		<div className="mr-12">
			<Image
				src={selectedImage || product?.images[0]}
				alt={product.title}
				className="w-full h-full object-cover rounded-lg"
				width={700}
				height={700}
			/>
			<div className="flex mt-1.5">
				{product?.images.map((image, index) => (
					<Image
						key={index}
						src={image}
						alt={product.title}
						className={`w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out ${
							selectedImage === image ? "border-2 border-gray-200" : ""
						}`}
						width={60}
						height={60}
						onClick={() => handleImageClick(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default ProductPreview;
